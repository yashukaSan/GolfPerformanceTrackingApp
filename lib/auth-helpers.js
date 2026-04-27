export async function isAdmin(user) {
  // Check user metadata or a 'profiles' table for admin flag
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role === "admin";
}
