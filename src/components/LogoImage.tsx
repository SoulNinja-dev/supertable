import axios from "axios";
import classNames from "classnames";
import Image from "next/image";
import { useRef } from "react";
import { useFormStore } from "~/stores/formStore";
import { api } from "~/utils/api";

const LogoImage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: generatePresignedUrl } =
    api.s3.generatePresignedUrl.useMutation();
  const { mutateAsync: editForm } = api.form.editForm.useMutation();

  const [form, setForm] = useFormStore((state) => [state.form, state.setForm]);

  const handleSubmit = async (file: File | null) => {
    if (!file) return;
    if (!form.id) return;

    try {
      const presignedUrl = await generatePresignedUrl({
        fileName: file.name,
        type: "logo",
      });

      await axios.put(presignedUrl, file, {
        headers: {
          // Content type image explicit
          "Content-Type": "image/*",
        },
      });

      // Extract the actual S3 URL from the presigned URL
      const uploadedImageUrl =
        new URL(presignedUrl).origin + new URL(presignedUrl).pathname;
      console.log(uploadedImageUrl);

      const response = await editForm({
        formId: form.id,
        logo: uploadedImageUrl,
      });

      setForm({
        ...form,
        logo: uploadedImageUrl,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className={classNames({
        "group flex max-w-[200px] cursor-pointer justify-center gap-x-2  rounded-xl px-3 py-6 text-gray-400 transition-colors duration-[50ms] ease-out hover:bg-gray-100":
          true,
        "border-2 border-dashed border-gray-300": !form.logo,
      })}
      style={{
        backgroundImage: form.logo ? `url(${form.logo})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) =>
          handleSubmit(e.target.files ? (e.target.files[0] as File) : null)
        }
      />

      {form.logo ? (
        <div className="rounded-full bg-black/20 px-3 py-3 opacity-0 duration-100 ease-in-out group-hover:opacity-100">

          <Image
            
            src="/pencil-edit.svg"
            width={30}
            height={30}
            alt="edit"
          />
        </div>
      ) : (
        <span className="flex items-center rounded-lg bg-gray-100 px-3 py-2">
          <Image src="/sparkles.svg" width={20} height={20} alt="sparkles" />{" "}
          Add a Logo
        </span>
      )}
    </div>
  );
};

export default LogoImage;
