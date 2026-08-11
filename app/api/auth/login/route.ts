import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEMO_ACCOUNTS = [
  {
    email: "buyer@fishlink.id",
    phone: "081298765432",
    password: "buyer123",
    fullName: "Bambang Hartono",
    businessName: "Restoran Seafood Bahari, Senopati",
    role: "buyer" as const,
    location: "Senopati, Jakarta Selatan",
  },
  {
    email: "supplier@fishlink.id",
    phone: "081234567890",
    password: "supplier123",
    fullName: "Pak Udung",
    businessName: "Tangkapan Pak Udung",
    role: "supplier" as const,
    location: "Depo Seafood Purwokerto, Jawa Tengah",
    supplierType: "nelayan_perorangan",
  },
];

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || url.includes("placeholder")) {
    return null;
  }

  return createClient(url, serviceKey);
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes("placeholder")) {
    return null;
  }

  return createClient(url, anonKey);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Silakan isi email/nomor HP dan kata sandi Anda." },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim();
    const cleanPhone = trimmed.replace(/\D/g, "");

    // 1. Check Demo Accounts
    const matchedDemo = DEMO_ACCOUNTS.find((acc) => {
      const matchEmail = acc.email.toLowerCase() === trimmed.toLowerCase();
      const matchPhone = cleanPhone.length >= 8 && acc.phone.replace(/\D/g, "") === cleanPhone;
      return (matchEmail || matchPhone) && acc.password === password;
    });

    if (matchedDemo) {
      return NextResponse.json({
        success: true,
        user: matchedDemo,
      });
    }

    // 2. Supabase Authentication
    const adminClient = getAdminClient();
    const anonClient = getAnonClient();
    const client = adminClient || anonClient;

    if (client) {
      let authEmail = trimmed;

      // If user typed a phone number, resolve their email from profiles table
      if (!trimmed.includes("@")) {
        const { data: profileByPhone } = await client
          .from("profiles")
          .select("id")
          .or(`phone.eq.${cleanPhone},phone.eq.${trimmed}`)
          .maybeSingle();

        if (profileByPhone && adminClient) {
          const { data: userAuth } = await adminClient.auth.admin.getUserById(profileByPhone.id);
          if (userAuth?.user?.email) {
            authEmail = userAuth.user.email;
          } else {
            authEmail = `${cleanPhone}@supplier.fishlink.id`;
          }
        } else {
          authEmail = `${cleanPhone}@supplier.fishlink.id`;
        }
      }

      // Perform Supabase sign in
      const { data: authData, error: authError } = await client.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (authError) {
        return NextResponse.json(
          {
            success: false,
            error: trimmed.includes("@")
              ? "Email atau kata sandi salah. Silakan periksa kembali."
              : "Nomor HP atau kata sandi salah. Pastikan nomor HP dan kata sandi Anda benar.",
          },
          { status: 401 }
        );
      }

      if (authData?.user) {
        // Fetch profile details
        const { data: profile } = await client
          .from("profiles")
          .select("role, full_name, phone")
          .eq("id", authData.user.id)
          .single();

        const role = (profile?.role === "supplier" ? "supplier" : "buyer") as "buyer" | "supplier";
        const fullName = profile?.full_name || authData.user.user_metadata?.full_name || "Pengguna";
        const phone = profile?.phone || cleanPhone || "";

        let businessName = "";
        let locationLabel = "";
        let supplierType = "";

        if (role === "buyer") {
          const { data: buyerProfile } = await client
            .from("buyer_profiles")
            .select("business_name, address")
            .eq("profile_id", authData.user.id)
            .single();
          businessName = buyerProfile?.business_name || "Usaha Pembeli";
          locationLabel = buyerProfile?.address || "";
        } else {
          const { data: supplierProfile } = await client
            .from("suppliers")
            .select("business_name, address_label, supplier_type")
            .eq("profile_id", authData.user.id)
            .single();
          businessName = supplierProfile?.business_name || `Mitra ${fullName}`;
          locationLabel = supplierProfile?.address_label || "";
          supplierType = supplierProfile?.supplier_type || "nelayan_perorangan";
        }

        return NextResponse.json({
          success: true,
          user: {
            id: authData.user.id,
            email: authData.user.email || authEmail,
            phone,
            fullName,
            businessName,
            role,
            location: locationLabel,
            supplierType,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Akun tidak ditemukan atau kata sandi salah. Silakan periksa kembali.",
      },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat masuk. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
