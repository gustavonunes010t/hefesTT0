import User from "../models/User.js";
import { DEFAULT_ADMIN, RESET_ADMIN_PASSWORD } from "../config.js";

export const ensureDefaultAdmin = async () => {
  const email = DEFAULT_ADMIN.email.trim().toLowerCase();
  const name = DEFAULT_ADMIN.name.trim() || "Administrador Hefestto";

  if (!DEFAULT_ADMIN.password || DEFAULT_ADMIN.password.length < 6) {
    throw new Error("DEFAULT_ADMIN_PASSWORD deve ter pelo menos 6 caracteres.");
  }

  const existingUser = await User.findOne({ email }).select("+password");

  if (existingUser) {
    existingUser.name = name;
    existingUser.role = "admin";

    if (RESET_ADMIN_PASSWORD) {
      existingUser.password = DEFAULT_ADMIN.password;
    }

    await existingUser.save();
    console.log(`Admin padrao pronto: ${email}`);
    return existingUser;
  }

  const admin = new User({
    name,
    email,
    password: DEFAULT_ADMIN.password,
    role: "admin"
  });

  await admin.save();
  console.log(`Admin padrao criado: ${email}`);
  return admin;
};
