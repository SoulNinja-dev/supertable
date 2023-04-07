import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useState } from "react";
import Checkbox from "~/components/Checkbox";
import CurrencyInput from "~/components/CurrencyInput";
import DateInput from "~/components/DateInput";
import DurationInput from "~/components/DurationInput";
import EmailInput from "~/components/EmailInput";
import FileInput from "~/components/FileInput";
import LinkInput from "~/components/LinkInput";
import LongText from "~/components/LongText";
import MultiSelect from "~/components/MultiSelect";
import NumberInput from "~/components/NumberInput";
import PercentInput from "~/components/PercentInput";
import PhoneInput from "~/components/PhoneInput";
import RatingInput from "~/components/RatingInput";
import ShortText from "~/components/ShortText";
import SingleSelect from "~/components/SingleSelect";
import { FormPageObjectGSSPCompatible } from "~/models/form";
import { formRouter } from "~/server/api/routers";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

const FormDesign = ({
  title,
  description,
  coverImage,
  logo,
  fields,
  // id,
  // createdAt,
  // updatedAt,
  // tableId,
  slug,
  seoDescription,
  seoImage,
}: // theme,
// headerImage,
// connectWallet,
// constraints,
// themeColor,
// submitMsg,
InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [checked, setChecked] = useState(false);
  const [rating, setRating] = useState(0);
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState();

  return (
    <>
      <Head>
        <title>{title}</title>
        <NextSeo
          title={title || "Form"}
          description={
            seoDescription || description || "No description provided."
          }
          canonical="https://www.canonical.ie/"
          openGraph={{
            url: "https://form.superteam.fun/" + slug,
            title: title || "Form",
            description:
              seoDescription || description || "No description provided.",
            images: [
              {
                url: seoImage || coverImage || "",
                width: 800,
                height: 600,
                alt: "SEO Image",
                type: "image/jpeg",
              },
              // {
              //   url: "https://www.example.ie/og-image-02.jpg",
              //   width: 900,
              //   height: 800,
              //   alt: "Og Image Alt Second",
              //   type: "image/jpeg",
              // },
              // { url: "https://www.example.ie/og-image-03.jpg" },
              // { url: "https://www.example.ie/og-image-04.jpg" },
            ],
            siteName: "Supertable",
          }}
          twitter={{
            handle: "@SuperteamDAO",
            site: "@site",
            cardType: "summary_large_image",
          }}
        />
      </Head>
      <main>
        <div className="h-full w-full overflow-y-auto bg-[#fff]/40">
          <div className="flex flex-1 flex-col items-center gap-y-3">
            {/* Cover Image */}
            <div
              className="flex h-[200px] w-full cursor-pointer items-center justify-center bg-gray-200"
              style={{
                backgroundImage: `url('${
                  coverImage
                    ? coverImage
                    : "https://billfish.org/wp-content/uploads/2019/08/placeholder-image.jpg"
                }')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            {/* Form SEO/MetaData and Logo */}
            <div className="relative -top-20 -mb-20 min-h-[300px] w-full max-w-lg rounded-md border bg-white px-6 pt-10 pb-5">
              <div
                className={`flex h-16 w-16 justify-center gap-x-2 rounded-xl px-3 py-6 text-gray-400`}
                style={{
                  backgroundImage: `url('${
                    logo
                      ? logo
                      : "https://billfish.org/wp-content/uploads/2019/08/placeholder-image.jpg"
                  }')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <h1 className="mt-4 w-full py-2 text-3xl font-semibold text-gray-500">
                {title}
              </h1>
              <h1 className="mt-1 w-full py-2 text-sm font-medium text-gray-500">
                {description}
              </h1>
            </div>
          </div>
          <div className="flex h-full flex-col items-center gap-8 py-20 px-96">
            {fields.map((field) => (
              <div className="flex w-full max-w-lg flex-col gap-2">
                <label className="flex flex-row items-center gap-2 text-lg font-medium">
                  {field.field.name}
                  {field.required ? (
                    <span className="text-red-400">*</span>
                  ) : null}
                </label>
                {field.field.type === "singleLineText" ? (
                  <ShortText placeholder={field.helpText || ""} />
                ) : field.field.type === "multilineText" ? (
                  <LongText placeholder={field.helpText || ""} />
                ) : field.field.type === "checkbox" ? (
                  <Checkbox checked={checked} setChecked={setChecked} />
                ) : field.field.type === "number" ? (
                  <NumberInput
                    setValue={setValue}
                    placeholder={field.helpText || ""}
                  />
                ) : field.field.type === "date" ? (
                  <DateInput />
                ) : field.field.type === "currency" ? (
                  <CurrencyInput placeholder={field.helpText || ""} />
                ) : field.field.type === "duration" ? (
                  <DurationInput />
                ) : field.field.type === "email" ? (
                  <EmailInput placeholder={field.helpText || ""} />
                ) : field.field.type === "multipleSelects" ? (
                  <MultiSelect
                    options={field.field.options.choices.map(
                      (choice: { id: string; color: string; name: string }) =>
                        choice.name
                    )}
                    placeholder={field.helpText || "No options selected"}
                  />
                ) : field.field.type === "percent" ? (
                  <PercentInput placeholder={field.helpText || ""} />
                ) : field.field.type === "phoneNumber" ? (
                  <PhoneInput placeholder={field.helpText || ""} />
                ) : field.field.type === "rating" ? (
                  <RatingInput rating={rating} setRating={setRating} />
                ) : field.field.type === "singleSelect" ? (
                  <SingleSelect
                    options={field.field.options.choices.map(
                      (choice: { id: string; color: string; name: string }) =>
                        choice.name
                    )}
                    selected={selected}
                    setSelected={setSelected}
                    placeholder={field.helpText || "No options selected"}
                  />
                ) : field.field.type === "url" ? (
                  <LinkInput placeholder={field.helpText || ""} />
                ) : (
                  <FileInput />
                )}
              </div>
            ))}
            {/* <div className="flex w-full max-w-lg flex-col gap-2">
              <label className="text-lg font-medium">yet another field</label>
              <CurrencyInput
                placeholder="put some moni in here"
                className="w-full max-w-lg"
              />
            </div> */}
            <div className="flex w-full max-w-lg flex-col items-end">
              <button className="rounded-lg bg-black py-2 px-4 font-semibold text-white outline-none transition duration-200 ease-in-out hover:bg-black/60 focus:bg-black/60">
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  FormPageObjectGSSPCompatible
> = async (context) => {
  const caller = formRouter.createCaller({
    session: await getServerSession(context.req, context.res, authOptions),
    prisma: prisma,
  });

  const res = await caller.getFormPage({
    domain: "fun.superteam.com",
    slug: context.params?.id as string,
  });

  return {
    props: {
      title: res.title,
      description: res.description,
      coverImage: res.coverImage,
      logo: res.logo,
      fields: res.fields,
      id: res.id,
      createdAt: res.createdAt.toISOString(),
      updatedAt: res.updatedAt.toISOString(),
      tableId: res.tableId,
      slug: res.slug,
      seoDescription: res.seoDescription,
      seoImage: res.seoImage,
      theme: res.theme,
      headerImage: res.headerImage,
      connectWallet: res.connectWallet,
      contraints: res.contraints,
      themeColor: res.themeColor,
      submitMsg: res.submitMsg,
    },
  };
};

export default FormDesign;
