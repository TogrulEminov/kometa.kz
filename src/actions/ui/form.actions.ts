"use server";
import { ZodError } from "zod";
import dayjs from "dayjs";
import ejs from "ejs";
import transporter from "@/src/lib/admin/nodemailer";
import { db } from "../../lib/admin/prismaClient";
import { formatZodErrors } from "../../utils/format-zod-errors";
import {
  contactSchema,
  CreateCallActionInput,
  createCallActionSchema,
  CreateContactInput,
  CreateModalInput,
  heroModalSchema,
} from "@/src/schema/callaction.schema";
import path from "path";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  code: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createCallAction(
  input: CreateCallActionInput
): Promise<ActionResult> {
  try {
    const validateData = createCallActionSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }
    const {
      category,
      fullName,
      email,
      phone,
      typesProduct,
      weight,
      dimensions,
    } = validateData.data;

    const newData = await db.callAction.create({
      data: {
        category,
        fullName,
        email,
        phone,
        typesProduct,
        weight,
        dimensions,
      },
    });

    return {
      success: true,
      data: newData,
      code: "SUCCESS",
      message: "Data created successfully",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};

      error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        success: false,
        error: "Məlumatlar düzgün deyil",
        errors: fieldErrors,
        code: "VALIDATION_ERROR",
      };
    }
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Məlumat yadda saxlanarkən xəta baş verdi",
    };
  }
}
export async function createPriceOffer(
  input: CreateModalInput
): Promise<ActionResult> {
  try {
    const validateData = heroModalSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const {
      category,
      fullName,
      email,
      phone,
      typesProduct,
      weight,
      assignedTo,
      dimensions,
      message,
    } = validateData.data;

    // 1. Əvvəlcə database-ə yaz
    const createdContact = await db.priceOffer.create({
      data: {
        fullName,
        email,
        phone,
        typesProduct,
        weight,
        dimensions,
        assignedTo,
        message: message ?? "",
      },
    });

    // 2. Sonra email göndər (transaksiyadan kənarda)
    try {
      const emailTemplate = path.join(
        process.cwd(),
        "src",
        "templates",
        "price-offer",
        "index.ejs"
      );

      const emailHTML = await ejs.renderFile(emailTemplate, {
        category,
        assignedTo,
        fullName,
        email,
        phone,
        typesProduct,
        weight,
        dimensions,
        message,
        year: dayjs().year(),
        createdAt: dayjs(createdContact.createdAt).format(
          "DD MMMM YYYY, [saat] HH:mm"
        ),
      });

      const transportUser = await db.employee.findUnique({
        where: {
          id: Number(createdContact.assignedTo),
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: transportUser?.email || process.env.SMTP_RECEIVER,
        subject: "Pulsuz Qiymət Təklifi",
        html: emailHTML,
      });
    } catch (emailError) {
      // Email xətası olsa belə, məlumat database-də qalır
      console.error("Email göndərmə xətası:", emailError);

      // İstəyə görə: Email göndərilmədisə kontaktı sil
      await db.priceOffer.delete({ where: { id: createdContact.id } });

      // Və ya: Sadəcə xəta qeyd et, lakin məlumatı saxla
      // Bu halda istifadəçiyə bildiriş göstər
      return {
        success: true,
        data: createdContact,
        code: "SUCCESS",
        message: "Məlumat saxlanıldı, lakin bildiriş emaili göndərilmədi",
      };
    }

    return {
      success: true,
      data: createdContact,
      code: "SUCCESS",
      message: "Məlumat uğurla saxlanıldı",
    };
  } catch (error) {
    // Daha ətraflı xəta loglama
    console.error("PriceOffer yaradılma xətası:", error);

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};

      error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        success: false,
        error: "Məlumatlar düzgün deyil",
        errors: fieldErrors,
        code: "VALIDATION_ERROR",
      };
    }

    // Xəta mesajını daha ətraflı göstər (development üçün)
    const errorMessage =
      error instanceof Error ? error.message : "Naməlum xəta";
    console.error("Ətraflı xəta:", errorMessage);

    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Məlumat yadda saxlanarkən xəta baş verdi",
      // Development mühitində ətraflı xəta göstər
      ...(process.env.NODE_ENV === "development" && {
        details: errorMessage,
      }),
    };
  }
}
export async function createContactUs(
  input: CreateContactInput
): Promise<ActionResult> {
  try {
    const validateData = contactSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const { fullName, email, phone, subject, message } = validateData.data;

    // 1. Əvvəlcə database-ə yaz
    const createdContact = await db.contactUs.create({
      data: {
        fullName,
        email,
        phone,
        subject,
        message: message ?? "",
      },
    });

    // 2. Sonra email göndər (transaksiyadan kənarda)
    try {
      const emailTemplate = path.join(
        process.cwd(),
        "src",
        "templates",
        "contact",
        "index.ejs"
      );
      const emailHTML = await ejs.renderFile(emailTemplate, {
        fullName,
        email,
        phone,
        subject,
        message,
        year: dayjs().year(),
        createdAt: dayjs(createdContact.createdAt).format(
          "DD MMMM YYYY, [saat] HH:mm"
        ),
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_RECEIVER,
        subject: "Pulsuz Qiymət Təklifi",
        html: emailHTML,
      });
    } catch (emailError) {
      // Email xətası olsa belə, məlumat database-də qalır
      console.error("Email göndərmə xətası:", emailError);

      // İstəyə görə: Email göndərilmədisə kontaktı sil
      await db.contactUs.delete({ where: { id: createdContact.id } });

      // Və ya: Sadəcə xəta qeyd et, lakin məlumatı saxla
      // Bu halda istifadəçiyə bildiriş göstər
      return {
        success: true,
        data: createdContact,
        code: "SUCCESS",
        message: "Məlumat saxlanıldı, lakin bildiriş emaili göndərilmədi",
      };
    }

    return {
      success: true,
      data: createdContact,
      code: "SUCCESS",
      message: "Məlumat uğurla saxlanıldı",
    };
  } catch (error) {
    // Daha ətraflı xəta loglama
    console.error("PriceOffer yaradılma xətası:", error);

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};

      error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        success: false,
        error: "Məlumatlar düzgün deyil",
        errors: fieldErrors,
        code: "VALIDATION_ERROR",
      };
    }

    // Xəta mesajını daha ətraflı göstər (development üçün)
    const errorMessage =
      error instanceof Error ? error.message : "Naməlum xəta";
    console.error("Ətraflı xəta:", errorMessage);

    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Məlumat yadda saxlanarkən xəta baş verdi",
      // Development mühitində ətraflı xəta göstər
      ...(process.env.NODE_ENV === "development" && {
        details: errorMessage,
      }),
    };
  }
}
