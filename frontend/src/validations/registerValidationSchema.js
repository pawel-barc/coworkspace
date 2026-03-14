import * as Yup from "yup";

const registerValidationsSchema = () => {
  return Yup.object({
    first_name: Yup.string()
      .min(2, "Le prénom doit contenir au moins deux caractères")
      .required("Ce champ est requis"),

    last_name: Yup.string()
      .min(2, "Le nom doit contenir au moins deux caractères")
      .required("Ce champ est requis"),

    email: Yup.string()
      .email("Email invalide")
      .required("Ce champ est requis"),

    password: Yup.string()
      .min(8, "Minimum 8 caractères")
      .matches(/[A-Z]/, "Une majuscule requise")
      .matches(/[a-z]/, "Une minuscule requise")
      .matches(/[0-9]/, "Un chiffre requis")
      .matches(/[\W_]/, "Un caractère spécial requis")
      .required("Ce champ est requis"),

    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas")
      .required("Veuillez confirmer votre mot de passe"),
  });
};

export default registerValidationsSchema;