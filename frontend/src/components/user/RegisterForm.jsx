/* eslint-disable react/prop-types */
import "../../styles/components/user/RegisterForm.css";

const RegisterForm = ({ formik, errorMessage }) => (
  <form onSubmit={formik.handleSubmit} className="user-form">
    <h1>Créer un compte</h1>

    <label>
      <h2>Prénom:</h2>
      <input
        type="text"
        name="first_name"
        placeholder="ex. Marie"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.first_name}
      />

      {formik.touched.first_name && formik.errors.first_name && (
        <div className="error">{formik.errors.first_name}</div>
      )}
    </label>

    <label>
      <h2>Nom:</h2>
      <input
        type="text"
        name="last_name"
        placeholder="ex. Dupont"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.last_name}
      />

      {formik.touched.last_name && formik.errors.last_name && (
        <div className="error">{formik.errors.last_name}</div>
      )}
    </label>

    <label>
      <h2>Email:</h2>
      <input
        type="email"
        name="email"
        placeholder="ex. marie@gmail.com"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />

      {formik.touched.email && formik.errors.email && (
        <div className="error">{formik.errors.email}</div>
      )}
    </label>

    <label>
      <h2>Mot de passe:</h2>
      <input
        type="password"
        name="password"
        placeholder="MotDePasse1?"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />

      {formik.touched.password && formik.errors.password && (
        <div className="error">{formik.errors.password}</div>
      )}
    </label>

    <label>
      <h2>Confirmez le mot de passe:</h2>
      <input
        type="password"
        name="repeatPassword"
        placeholder="MotDePasse1?"
        onChange={formik.handleChange}
        onBlur={() => formik.setFieldTouched("repeatPassword", true, true)}
        value={formik.values.repeatPassword}
      />

      {formik.touched.repeatPassword && formik.errors.repeatPassword && (
        <div className="error">{formik.errors.repeatPassword}</div>
      )}
    </label>

    {formik.errors.api && <div>{formik.errors.api}</div>}

    {errorMessage && <div className="error-message">{errorMessage}</div>}

    <button className="user-btn" type="submit" disabled={formik.isSubmitting}>
      Valider
    </button>
  </form>
);

export default RegisterForm;
