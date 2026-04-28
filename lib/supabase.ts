import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from '@supabase/ssr';
/**
 * GreenDrop Supabase Client
 * Consumes environment variables for secure DB access
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase Environment Variables");
// }

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// export const supabase = createClient(
//   supabaseUrl || "https://enzlkvflsolelruqcktq.supabase.co",
//   supabaseAnonKey ||
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuemxrdmZsc29sZWxydXFja3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTA0MDYsImV4cCI6MjA5Mjg4NjQwNn0.gkcBwVDK2THLS8qizuvVRtgCVR9M6vzbRl8BtdkCLfU",
//   {
//     auth: {
//       autoRefreshToken: true,
//       persistSession: true,
//       detectSessionInUrl: true
//     }
//   }
// );

/**
 * Utility: Fetch User Profile with Subscription Status
 * Aligns with PRD Section 04 Access Control
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, subscription_status")
    .eq("id", userId)
    .single();

  if (error) console.error("Error fetching profile:", error);
  return data;
};
