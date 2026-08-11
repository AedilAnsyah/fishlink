import { createClient } from "@/lib/supabase/client";

export interface RegisteredUser {
  id: string;
  email: string;
  phone: string;
  password?: string;
  fullName: string;
  businessName: string;
  role: "buyer" | "supplier";
  location: string;
  supplierType?: string;
  createdAt: string;
}

const STORAGE_KEY = "fishlink_registered_users_db";

const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: "u-seed-buyer",
    email: "buyer@fishlink.id",
    phone: "081298765432",
    password: "buyer123",
    fullName: "Bambang Hartono",
    businessName: "Restoran Seafood Bahari, Senopati",
    role: "buyer",
    location: "Senopati, Jakarta Selatan",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-seed-supplier",
    email: "supplier@fishlink.id",
    phone: "081234567890",
    password: "supplier123",
    fullName: "Pak Udung",
    businessName: "Tangkapan Pak Udung",
    role: "supplier",
    location: "Depo Seafood Purwokerto, Jawa Tengah",
    supplierType: "nelayan_perorangan",
    createdAt: new Date().toISOString(),
  },
];

/**
 * Get all registered users from local persistent storage
 */
export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed: RegisteredUser[] = JSON.parse(raw);
    // Ensure default demo users exist
    const merged = [...DEFAULT_USERS];
    for (const u of parsed) {
      if (!merged.some((m) => m.email.toLowerCase() === u.email.toLowerCase() || (m.phone && m.phone === u.phone))) {
        merged.push(u);
      }
    }
    return merged;
  } catch {
    return DEFAULT_USERS;
  }
}

/**
 * Save or update a user in local persistent storage
 */
export function saveRegisteredUser(user: RegisteredUser): void {
  if (typeof window === "undefined") return;
  try {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(
      (u) =>
        (user.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
        (user.phone && u.phone.replace(/\D/g, "") === user.phone.replace(/\D/g, ""))
    );

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save user locally:", err);
  }
}

/**
 * Find user by email or phone
 */
export function findUserByIdentifier(identifier: string): RegisteredUser | undefined {
  const users = getRegisteredUsers();
  const trimmed = identifier.trim().toLowerCase();
  const digitsOnly = identifier.replace(/\D/g, "");

  return users.find((u) => {
    const emailMatch = u.email.toLowerCase() === trimmed;
    const phoneMatch = digitsOnly.length >= 8 && u.phone.replace(/\D/g, "") === digitsOnly;
    return emailMatch || phoneMatch;
  });
}

/**
 * Set active user session cookies
 */
export function setSessionCookies(user: {
  role: "buyer" | "supplier";
  fullName: string;
  businessName: string;
  location?: string;
  phone?: string;
  supplierType?: string;
}): void {
  document.cookie = `fishlink_mock_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `fishlink_mock_name=${encodeURIComponent(user.fullName)}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `fishlink_mock_business=${encodeURIComponent(user.businessName)}; path=/; max-age=86400; SameSite=Lax`;
  if (user.location) {
    document.cookie = `fishlink_mock_location=${encodeURIComponent(user.location)}; path=/; max-age=86400; SameSite=Lax`;
  }
  if (user.phone) {
    document.cookie = `fishlink_mock_phone=${encodeURIComponent(user.phone)}; path=/; max-age=86400; SameSite=Lax`;
  }
  if (user.supplierType) {
    document.cookie = `fishlink_mock_supplier_type=${encodeURIComponent(user.supplierType)}; path=/; max-age=86400; SameSite=Lax`;
  }
}

/**
 * Clear all session cookies
 */
export function clearSessionCookies(): void {
  document.cookie = "fishlink_mock_role=; path=/; max-age=0";
  document.cookie = "fishlink_mock_name=; path=/; max-age=0";
  document.cookie = "fishlink_mock_business=; path=/; max-age=0";
  document.cookie = "fishlink_mock_location=; path=/; max-age=0";
  document.cookie = "fishlink_mock_phone=; path=/; max-age=0";
  document.cookie = "fishlink_mock_supplier_type=; path=/; max-age=0";
}

/**
 * Full register flow: saves locally and syncs with Supabase
 */
export async function registerAccount(params: {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  businessName: string;
  role: "buyer" | "supplier";
  location: string;
  businessType?: string;
  supplierType?: string;
}): Promise<{ success: boolean; error?: string; user?: RegisteredUser }> {
  // Check if identifier already exists locally
  const existing = findUserByIdentifier(params.email || params.phone);
  if (existing) {
    // If it's already registered with same email or phone
    const isSameEmail = params.email && existing.email.toLowerCase() === params.email.toLowerCase();
    return {
      success: false,
      error: isSameEmail
        ? "Email ini sudah terdaftar. Silakan masuk menggunakan email dan kata sandi Anda."
        : "Nomor HP ini sudah terdaftar. Silakan masuk menggunakan nomor HP dan kata sandi Anda.",
    };
  }

  const userId = `u-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const effectiveEmail = params.email.trim() || `${params.phone.replace(/\D/g, "")}@supplier.fishlink.id`;

  const newUser: RegisteredUser = {
    id: userId,
    email: effectiveEmail,
    phone: params.phone,
    password: params.password,
    fullName: params.fullName,
    businessName: params.businessName,
    role: params.role,
    location: params.location,
    supplierType: params.supplierType,
    createdAt: new Date().toISOString(),
  };

  // 1. Always save in local registry
  saveRegisteredUser(newUser);

  // 2. Set session cookies
  setSessionCookies({
    role: newUser.role,
    fullName: newUser.fullName,
    businessName: newUser.businessName,
    location: newUser.location,
    phone: newUser.phone,
    supplierType: newUser.supplierType,
  });

  // 3. Attempt Supabase Auth & Database insertion
  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: effectiveEmail,
      password: params.password,
      options: {
        data: {
          full_name: params.fullName,
          role: params.role,
        },
      },
    });

    if (authData?.user) {
      await supabase.from("profiles").insert({
        id: authData.user.id,
        role: params.role,
        full_name: params.fullName,
        phone: params.phone,
      });

      if (params.role === "buyer") {
        await supabase.from("buyer_profiles").insert({
          profile_id: authData.user.id,
          business_name: params.businessName,
          business_type: params.businessType || "Restoran Seafood",
          address: params.location,
        });
      } else {
        await supabase.from("suppliers").insert({
          profile_id: authData.user.id,
          supplier_type: params.supplierType || "nelayan_perorangan",
          business_name: params.businessName,
          address_label: params.location,
          location: `POINT(109.2344 -7.4243)`,
        });
      }
    }
  } catch (err) {
    console.warn("Supabase registration sync warning:", err);
  }

  return { success: true, user: newUser };
}

/**
 * Full login flow: verifies local registry & Supabase Auth
 */
export async function loginAccount(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: RegisteredUser }> {
  const trimmed = identifier.trim();

  // 1. Check in local registered users registry first
  const localMatch = findUserByIdentifier(trimmed);

  if (localMatch) {
    if (localMatch.password && localMatch.password !== password) {
      return { success: false, error: "Kata sandi yang Anda masukkan salah. Silakan coba lagi." };
    }

    // Success via local registry
    setSessionCookies({
      role: localMatch.role,
      fullName: localMatch.fullName,
      businessName: localMatch.businessName,
      location: localMatch.location,
      phone: localMatch.phone,
      supplierType: localMatch.supplierType,
    });

    // Also attempt Supabase sign in in background to establish realtime session
    try {
      const supabase = createClient();
      await supabase.auth.signInWithPassword({
        email: localMatch.email,
        password,
      });
    } catch {
      // Ignore background sync error
    }

    return { success: true, user: localMatch };
  }

  // 2. If not found in local registry, attempt Supabase Auth directly
  try {
    const supabase = createClient();
    let authEmail = trimmed;
    if (!trimmed.includes("@")) {
      authEmail = `${trimmed.replace(/\D/g, "")}@supplier.fishlink.id`;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    if (error) {
      return {
        success: false,
        error: trimmed.includes("@")
          ? "Email atau kata sandi salah. Silakan periksa kembali."
          : "Nomor HP atau kata sandi salah. Pastikan Anda sudah terdaftar.",
      };
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, phone")
        .eq("id", data.user.id)
        .single();

      const role = (profile?.role === "supplier" ? "supplier" : "buyer") as "buyer" | "supplier";
      const fullName = profile?.full_name || data.user.user_metadata?.full_name || "Pengguna";
      const phone = profile?.phone || "";

      let businessName = "";
      let locationLabel = "";
      let supplierType = "";

      if (role === "buyer") {
        const { data: buyerProfile } = await supabase
          .from("buyer_profiles")
          .select("business_name, address")
          .eq("profile_id", data.user.id)
          .single();
        businessName = buyerProfile?.business_name || "Usaha Pembeli";
        locationLabel = buyerProfile?.address || "";
      } else {
        const { data: supplierProfile } = await supabase
          .from("suppliers")
          .select("business_name, address_label, supplier_type")
          .eq("profile_id", data.user.id)
          .single();
        businessName = supplierProfile?.business_name || `Mitra ${fullName}`;
        locationLabel = supplierProfile?.address_label || "";
        supplierType = supplierProfile?.supplier_type || "nelayan_perorangan";
      }

      const syncedUser: RegisteredUser = {
        id: data.user.id,
        email: data.user.email || authEmail,
        phone,
        password,
        fullName,
        businessName,
        role,
        location: locationLabel,
        supplierType,
        createdAt: new Date().toISOString(),
      };

      // Save to local registry for subsequent instant logins
      saveRegisteredUser(syncedUser);

      setSessionCookies({
        role,
        fullName,
        businessName,
        location: locationLabel,
        phone,
        supplierType,
      });

      return { success: true, user: syncedUser };
    }
  } catch {
    // Network or other failure
  }

  return {
    success: false,
    error: "Akun tidak ditemukan atau kata sandi salah. Pastikan email/no HP dan kata sandi Anda benar.",
  };
}
