import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import CoverImage from "~/components/CoverImage";
import CurrencyInput from "~/components/CurrencyInput";
import LogoImage from "~/components/LogoImage";
import ShortText from "~/components/ShortText";

const FormDesign: NextPage = () => {
  return (
    <>
      <Head>
        <title>Form</title>
        <NextSeo
          title="Using More of Config"
          description="This example uses more of the available config options."
          canonical="https://www.canonical.ie/"
          openGraph={{
            url: "https://www.url.ie/a",
            title: "Open Graph Title",
            description: "Open Graph Description",
            images: [
              {
                url: "https://www.example.ie/og-image-01.jpg",
                width: 800,
                height: 600,
                alt: "Og Image Alt",
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
            siteName: "SiteName",
          }}
          twitter={{
            handle: "@handle",
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
                backgroundImage: `url('/supertable.svg')`,
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
                  backgroundImage: `url('/supertable.svg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <h1 className="mt-4 w-full py-2 text-3xl font-semibold text-gray-500">
                Form Title
              </h1>
              <h1 className="mt-1 w-full py-2 text-sm font-medium text-gray-500">
                Form Description
              </h1>
            </div>
          </div>
          <div className="flex h-full items-center py-20 px-96 flex-col gap-8">
            <div className="flex w-full max-w-lg flex-col gap-2">
              <label className="text-lg font-medium">field name</label>
              <ShortText placeholder="test placeholder" />
            </div>
            <div className="flex w-full max-w-lg flex-col gap-2">
              <label className="text-lg font-medium">yet another field</label>
              <CurrencyInput placeholder="put some moni in here" className="w-full max-w-lg" />
            </div>
            <div className="flex flex-col items-end w-full max-w-lg">
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      title: "Form Design",
      description: "A page with good and clean forms",
    },
  };
};

export default FormDesign;
