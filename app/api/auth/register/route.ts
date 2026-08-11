import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || url.includes("placeholder")) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
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
    const {
      email,
      phone,
      password,
      fullName,
      businessName,
      role,
      location,
      supplierType,
      businessType,
    } = body;

    if (!fullName || !password || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: "Mohon lengkapi data pendaftaran Anda." },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || "").replace(/\D/g, "");
    const effectiveEmail = (email || "").trim() || `${cleanPhone}@supplier.fishlink.id`;
    const effectiveBusiness = (businessName || "").trim() || (role === "supplier" ? `Tangkapan ${fullName}` : "Usaha Pembeli");
    const effectiveLocation = (location || "").trim() || "Pesisir Indonesia";
    const effectiveSupplierType = supplierType || "nelayan_perorangan";

    const adminClient = getAdminClient();
    const anonClient = getAnonClient();

    let createdUserId = `u-${Date.now()}`;

    // 1. Supabase Admin (auto-confirm email, bypass rate limit & RLS)
    if (adminClient) {
      // Check if phone already registered in profiles
      if (cleanPhone) {
        const { data: existingProfile } = await adminClient
          .from("profiles")
          .select("id, phone")
          .or(`phone.eq.${cleanPhone},phone.eq.${phone}`)
          .maybeSingle();

        if (existingProfile) {
          return NextResponse.json(
            {
              success: false,
              error: "Nomor HP ini sudah terdaftar. Silakan langsung masuk di halaman Login.",
            },
            { status: 400 }
          );
        }
      }

      // Create confirmed user directly in auth.users
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: effectiveEmail,
        password,
        email_confirm: true, // Auto confirmed so user can login from ANY device immediately
        user_metadata: {
          full_name: fullName,
          role,
        },
      });

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("exists")) {
          return NextResponse.json(
            {
              success: false,
              error: "Email atau Nomor HP ini sudah terdaftar. Silakan langsung masuk di halaman Login.",
            },
            { status: 400 }
          );
        }
        console.warn("Admin createUser warning:", authError.message);
      }

      if (authData?.user) {
        createdUserId = authData.user.id;

        // Insert into profiles
        await adminClient.from("profiles").upsert({
          id: authData.user.id,
          role,
          full_name: fullName,
          phone: cleanPhone || phone || null,
        });

        // Insert into role-specific table
        if (role === "buyer") {
          await adminClient.from("buyer_profiles").upsert({
            profile_id: authData.user.id,
            business_name: effectiveBusiness,
            business_type: businessType || "Restoran Seafood",
            address: effectiveLocation,
          });
        } else {
          await adminClient.from("suppliers").upsert({
            profile_id: authData.user.id,
            supplier_type: effectiveSupplierType,
            business_name: effectiveBusiness,
            address_label: effectiveLocation,
            location: `POINT(109.2344 -7.4243)`,
          });
        }
      }
    } else if (anonClient) {
      // 2. Fallback to standard Supabase Client
      const { data: authData, error: authError } = await anonClient.auth.signUp({
        email: effectiveEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("exists")) {
          return NextResponse.json(
            {
              success: false,
              error: "Email atau Nomor HP ini sudah terdaftar. Silakan langsung masuk di halaman Login.",
            },
            { status: 400 }
          );
        }
      }

      if (authData?.user) {
        createdUserId = authData.user.id;
        await anonClient.from("profiles").insert({
          id: authData.user.id,
          role,
          full_name: fullName,
          phone: cleanPhone || phone || null,
        });
        if (role === "buyer") {
          await anonClient.from("buyer_profiles").insert({
            profile_id: authData.user.id,
            business_name: effectiveBusiness,
            business_type: businessType || "Restoran Seafood",
            address: effectiveLocation,
          });
        } else {
          await anonClient.from("suppliers").insert({
            profile_id: authData.user.id,
            supplier_type: effectiveSupplierType,
            business_name: effectiveBusiness,
            address_label: effectiveLocation,
            location: `POINT(109.2344 -7.4243)`,
          });
        }
      }
    }

    const userData = {
      id: createdUserId,
      email: effectiveEmail,
      phone: cleanPhone || phone || "",
      fullName,
      businessName: effectiveBusiness,
      role,
      location: effectiveLocation,
      supplierType: effectiveSupplierType,
    };

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat mendaftar. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
