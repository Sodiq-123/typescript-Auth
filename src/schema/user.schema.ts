import { object, string, TypeOf } from "zod";

export const createUserSchmema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "password is required",
    }).min(6, "Password must be at least 6 characters long"),
    passwordConfirmation: string({
      required_error: "Confirm your password",
    }),
    email: string({
      required_error: "Email is required"
    }).email("Email is invalid")
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"]
  })
})


export type createUserInput = Omit<
TypeOf<typeof createUserSchmema>,
'body.passwordConfirmation'>


// export const createUserSessionSchema = object({
//   body: object({
//     password: string()
//       .required("Password is required")
//       .min(6, "Password is too short - should be 6 chars minimum.")
//       .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),

//     email: string()
//       .email("Must be a valid email")
//       .required("Email is required"),
//   }),
// });