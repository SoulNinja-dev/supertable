import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
import { ThemeData, themes } from "~/utils/themes";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
  WalletConnectButton,
  WalletModalButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

// theme
// headerImage,
// connectWallet,
// constraints,
// themeColor,
// submitMsg,
const FormDesign = ({
  title,
  description,
  coverImage,
  logo,
  fields,
  slug,
  seoDescription,
  seoImage,
  themeData,
  connectWallet
}:
  InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [checked, setChecked] = useState(false);
  const [rating, setRating] = useState(0);
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState<number>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter(),
    ],
    [network]
  );

  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const onSubmit: SubmitHandler<{
    [key: string]: string | number | boolean | FileList | number[];
  }> = (data) => console.log(data);

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
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <main>
              <div className="h-full w-full overflow-y-auto" style={{
                backgroundColor: themeData.bgColor,
                color: themeData.textColor
              }}>
                <div className="flex flex-1 flex-col items-center gap-y-3">
                  {/* Cover Image */}
                  <div
                    className="flex h-[200px] w-full cursor-pointer items-center justify-center bg-gray-200"
                    style={{
                      backgroundImage: `url('${coverImage
                        ? coverImage
                        : "https://billfish.org/wp-content/uploads/2019/08/placeholder-image.jpg"
                        }')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                  {/* Form SEO/MetaData and Logo */}
                  <div className="relative -top-20 -mb-20 min-h-[300px] w-full max-w-lg rounded-md px-6 pt-10 pb-5" style={{
                    backgroundColor: themeData.popupColor,
                    color: themeData.textColor,
                  }}>
                    <div
                      className={`flex h-16 w-16 justify-center gap-x-2 rounded-xl px-3 py-6`}
                      style={{
                        backgroundImage: `url('${logo
                          ? logo
                          : "https://billfish.org/wp-content/uploads/2019/08/placeholder-image.jpg"
                          }')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                    <h1 className="mt-4 w-full py-2 text-3xl font-semibold">
                      {title}
                    </h1>
                    <h1 className="mt-1 w-full py-2 text-sm font-medium">
                      {description}
                    </h1>
                  </div>
                </div>
                <form
                  className="flex h-full flex-col items-center gap-8 py-20 px-96"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {connectWallet ?
                    (<div>
                      <WalletModalButton />
                    </div>) : null}
                  {fields.map((field) => (
                    <div className="flex w-full max-w-lg flex-col gap-2">
                      <label className="flex flex-row items-center gap-2 text-lg font-medium">
                        {field.field.name}
                        {field.required ? (
                          <span className="text-red-400">*</span>
                        ) : null}
                      </label>
                      {field.field.type === "singleLineText" ? (
                        <ShortText
                          placeholder={field.helpText || ""}
                          maxLength={field.field?.options?.maxLength || undefined}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "multilineText" ? (
                        <LongText
                          themeData={themeData}
                          placeholder={field.helpText || ""}
                          maxLength={field.field?.options?.maxLength || undefined}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                        />
                      ) : field.field.type === "checkbox" ? (
                        <Checkbox
                          checked={checked}
                          setChecked={setChecked}
                          label={field.helpText || undefined}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "number" ? (
                        <NumberInput
                          value={value}
                          setValue={setValue}
                          placeholder={field.helpText || ""}
                          maxLength={field.field?.options?.maxLength || undefined}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "date" ? (
                        <DateInput
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "currency" ? (
                        <CurrencyInput
                          placeholder={field.helpText || ""}
                          maxLength={field.field?.options?.maxLength || undefined}
                          register={register}
                          registerDataA={field.field.name}
                          themeData={themeData}
                          registerDataB={field.required}
                        />
                      ) : field.field.type === "duration" ? (
                        <DurationInput
                          register={register}
                          registerDataA={field.field.name}
                          themeData={themeData}
                          registerDataB={field.required}
                        />
                      ) : field.field.type === "email" ? (
                        <EmailInput
                          placeholder={field.helpText || ""}
                          maxLength={field.field?.options?.maxLength || undefined}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "multipleAttachments" ? (
                        <FileInput
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "percent" ? (
                        <PercentInput
                          placeholder={field.helpText || ""}
                          maxLength={field.field?.options?.maxLength || undefined}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "phoneNumber" ? (
                        <PhoneInput
                          placeholder={field.helpText || ""}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "rating" ? (
                        <RatingInput
                          rating={rating}
                          setRating={setRating}
                          maxRating={field.field.options.max}
                          register={register}
                          registerDataA={field.field.name}
                          themeData={themeData}
                          registerDataB={field.required}
                        />
                      ) : field.field.type === "singleSelect" ? (
                        <SingleSelect
                          options={field.field.options.choices.map(
                            (choice: { id: string; color: string; name: string }) =>
                              choice.name
                          )}
                          selected={selected}
                          setSelected={setSelected}
                          placeholder={field.helpText || "No options selected"}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : field.field.type === "url" ? (
                        <LinkInput
                          placeholder={field.helpText || ""}
                          maxLength={field.field?.options?.maxLength || undefined}
                          register={register}
                          registerDataA={field.field.name}
                          registerDataB={field.required}
                          themeData={themeData}
                        />
                      ) : (
                        <Controller
                          name={field.field.name}
                          control={control}
                          render={({ field: field_ }) => (
                            <MultiSelect
                              themeData={themeData}
                              options={field.field.options.choices.map(
                                (choice: {
                                  id: string;
                                  color: string;
                                  name: string;
                                }) => choice.name
                              )}
                              {...field_}
                              placeholder={field.helpText || "No options selected"}
                            />
                          )}
                        />
                      )}
                      {errors[field.field.name] ? (
                        <div className="text-sm font-medium text-red-400">
                          {(errors[field.field.name]?.type as string) === "required"
                            ? "This field is required"
                            : (errors[field.field.name]?.type as string) === "pattern" ? (errors[field.field.name]?.message as string) : (errors[field.field.name]?.type as string)}
                        </div>
                      ) : null}
                    </div>
                  ))}
                  <div className="flex w-full max-w-lg flex-col items-end">
                    <button
                      type="submit"
                      className="rounded-lg py-2 px-4 font-semibold outline-none transition duration-200 ease-in-out"
                      style={{
                        backgroundColor: themeData.buttonColor,
                        color: themeData.bgColor,
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};



export const getServerSideProps: GetServerSideProps<
  FormPageObjectGSSPCompatible & { themeData: ThemeData }
> = async (context) => {
  const caller = formRouter.createCaller({
    session: await getServerSession(context.req, context.res, authOptions),
    prisma: prisma,
  });

  const res = await caller.getFormPage({
    domain: "test.com",
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
      themeData: res.theme === "monochromatic" ? themes[res.theme](res.themeColor || undefined) : themes[res.theme](),
    },
  };
};

export default FormDesign;
