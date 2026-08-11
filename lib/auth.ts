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
  createdAt?: string;
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
  },
];

/**
 * Get all registered users from local storage
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
 * Save user locally
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
 * Register account via Server API (central Supabase database)
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
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Gagal mendaftar. Silakan coba lagi.",
      };
    }

    const registeredUser: RegisteredUser = {
      ...data.user,
      password: params.password,
    };

    // Save locally for instant offline cache
    saveRegisteredUser(registeredUser);

    // Set session cookies
    setSessionCookies({
      role: registeredUser.role,
      fullName: registeredUser.fullName,
      businessName: registeredUser.businessName,
      location: registeredUser.location,
      phone: registeredUser.phone,
      supplierType: registeredUser.supplierType,
    });

    return { success: true, user: registeredUser };
  } catch (err: any) {
    console.error("registerAccount error:", err);
    return {
      success: false,
      error: "Terjadi gangguan koneksi server. Silakan periksa jaringan internet Anda.",
    };
  }
}

/**
 * Login account via Server API (central Supabase database)
 */
export async function loginAccount(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: RegisteredUser }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.user) {
      // If server failed or offline, fallback to local match if available
      const localMatch = findUserByIdentifier(identifier);
      if (localMatch && localMatch.password === password) {
        setSessionCookies({
          role: localMatch.role,
          fullName: localMatch.fullName,
          businessName: localMatch.businessName,
          location: localMatch.location,
          phone: localMatch.phone,
          supplierType: localMatch.supplierType,
        });
        return { success: true, user: localMatch };
      }

      return {
        success: false,
        error: data.error || "Email/Nomor HP atau kata sandi salah. Silakan periksa kembali.",
      };
    }

    const user: RegisteredUser = data.user;

    // Cache locally
    saveRegisteredUser(user);

    // Set session cookies
    setSessionCookies({
      role: user.role,
      fullName: user.fullName,
      businessName: user.businessName,
      location: user.location,
      phone: user.phone,
      supplierType: user.supplierType,
    });

    return { success: true, user };
  } catch (err: any) {
    // If network error, check local cache
    const localMatch = findUserByIdentifier(identifier);
    if (localMatch && localMatch.password === password) {
      setSessionCookies({
        role: localMatch.role,
        fullName: localMatch.fullName,
        businessName: localMatch.businessName,
        location: localMatch.location,
        phone: localMatch.phone,
        supplierType: localMatch.supplierType,
      });
      return { success: true, user: localMatch };
    }

    return {
      success: false,
      error: "Terjadi gangguan koneksi. Pastikan internet Anda aktif lalu coba lagi.",
    };
  }
}
