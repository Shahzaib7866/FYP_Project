import React, { useState } from "react";
import toast from "react-hot-toast";
import { TypographyH2, TypographyMuted, TypographyP } from "../ui/typography";
import { Input } from "../ui/input";
import { LoaderButton } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import SelectInput from "../ui/SelectInput";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { emailCheck, register } from "../../api";
import PhoneInput from "../ui/PhoneInput";
import AuthLayout from "./AuthLayout";
import {
  AccountTypes,
  Cities,
  Industries,
  onFormSubmit,
} from "../../lib/utils";
import * as Yup from "yup";

const signupformValidation = Yup.object({
  email: Yup.string().email("Email is not valid").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[.!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.{8,})/,
      "Password must be at least 8 characters long, contain at least one special character, one number, and one lowercase letter."
    ),
});

const aboutformValidation = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .max(255, "Max 255 characters are allowed"),
});

const SignupForm = ({ values, onSubmit, isLoading }) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    onFormSubmit(e, signupformValidation, setErrors, onSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <Input
          name="email"
          required
          placeholder="Email Address"
          type="email"
          defaultValue={values.email}
          onKeyDown={() => {
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
          error={errors.email}
        />
        <div className="w-full max-w-96">
          <Input
            name="password"
            required
            defaultValue={values.password}
            placeholder="Password"
            type="password"
            onKeyDown={() => {
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            error={errors.password}
          />
          {!errors.password && (
            <span className="text-xs text-muted-foreground pl-1">
              Use 8 or more characters, with a mix of letters, numbers and
              symbols
            </span>
          )}
        </div>
      </div>
      <LoaderButton
        isLoading={isLoading}
        type="submit"
        size="lg"
        className="bg-blue-500 rounded-full"
      >
        Continue
      </LoaderButton>
    </form>
  );
};

const AboutForm = ({ onSubmit, isLoading }) => {
  const [type, setType] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    onFormSubmit(e, aboutformValidation, setErrors, onSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <Input name="name" required placeholder="Name" error={errors.name} />
        <PhoneInput name="phone" required placeholder="Phone" />
        <SelectInput
          required
          name="type"
          placeholder="What are you looking for?"
          options={AccountTypes}
          onChange={setType}
        />
        {type === "employer" && (
          <SelectInput
            required
            name="industry"
            placeholder="What is your industry?"
            options={Industries}
          />
        )}
      </div>
      <LoaderButton
        type="submit"
        isLoading={isLoading}
        size="lg"
        className="bg-blue-500 rounded-full "
      >
        Continue
      </LoaderButton>
    </form>
  );
};

const LocationForm = ({ onSubmit, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    onSubmit(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <SelectInput
          options={Cities}
          placeholder="Select location"
          name="location"
          required
        />
      </div>
      <LoaderButton
        type="submit"
        isLoading={isLoading}
        size="lg"
        className="bg-blue-500 rounded-full "
      >
        Sign up
      </LoaderButton>
    </form>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState("signup");
  const [values, setValues] = useState({});

  const emailCheckMutation = useMutation({
    mutationFn: emailCheck,
    onSuccess: () => {
      setFormType("about");
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      sessionStorage.setItem("notVerified", res.data.email);
      navigate("/not-verified");
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const onSubmit = async (formData) => {
    if (formType === "signup") {
      setValues({ ...formData });
      emailCheckMutation.mutate({ email: formData.email });
    } else if (formType === "about") {
      setFormType("location");
      setValues({ ...values, ...formData, phone: "+92" + formData.phone });
    } else {
      registerMutation.mutate({ ...values, ...formData });
    }
  };

  return (
    <AuthLayout
      footer={
        formType === "signup" && (
          <TypographyP className="text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              <b>Sign in</b>
            </Link>
          </TypographyP>
        )
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          {formType === "about" && (
            <ArrowLeft
              className="cursor-pointer"
              onClick={() => setFormType("signup")}
            />
          )}
          <TypographyH2>
            {formType === "signup"
              ? "Sign up"
              : formType === "about"
              ? "Almost there"
              : `Welcome, ${values.name}! What's your location?`}
          </TypographyH2>
        </div>
        <TypographyMuted>
          {formType === "signup" ? (
            <>
              Let's get you sign up and make the most of your <br />
              professional life
            </>
          ) : formType === "about" ? (
            <>
              We require a few more details to finish setting up <br /> your
              account
            </>
          ) : (
            <>See companies, jobs, and news updates in your area.</>
          )}
        </TypographyMuted>
      </div>
      {formType === "signup" ? (
        <SignupForm
          values={values}
          onSubmit={onSubmit}
          isLoading={emailCheckMutation.isPending}
        />
      ) : formType === "about" ? (
        <AboutForm
          values={values}
          onSubmit={onSubmit}
          isLoading={registerMutation.isPending}
        />
      ) : (
        <LocationForm
          values={values}
          onSubmit={onSubmit}
          isLoading={registerMutation.isPending}
        />
      )}
    </AuthLayout>
  );
};

export default Register;
