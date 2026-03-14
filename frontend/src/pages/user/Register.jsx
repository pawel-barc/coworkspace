import RegisterForm from "../../components/user/RegisterForm";
import registerValidationsSchema from "../../validations/registerValidationSchema";
import { useFormik } from "formik";
import registerUser from "../../api/user/registerApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

// import "../../../styles/pages/Register.css";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },

    validationSchema: registerValidationsSchema(),

    onSubmit: async (values, { setErrors }) => {
      try {
        const apiResponse = await registerUser(values);

        if (apiResponse.success) {
          toast.success(
            "Compte créé avec succès ! Veuillez vérifier votre email.",
          );

          navigate("/login");
        } else if (apiResponse.error) {
          setErrorMessage(apiResponse.error);
        }
      } catch (error) {
        console.error("Erreur capturée:", error);

        setErrors({
          api: error.message || "Une erreur est survenue",
        });
      }
    },
  });

  return (
    <div className="register-page">
      <RegisterForm formik={formik} errorMessage={errorMessage} />
    </div>
  );
};

export default Register;
