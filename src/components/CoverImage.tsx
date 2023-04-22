import Image from "next/image";
import { useRef } from "react";
import axios from "axios";
import { useFormStore } from "~/stores/formStore";
import { api } from "~/utils/api";

const CoverImage = () => {
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
        type: "cover",
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
        coverImage: uploadedImageUrl,
      });

      setForm({
        ...form,
        coverImage: uploadedImageUrl,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className="relative h-[200px] w-full items-center justify-center bg-[#fad285]"
        style={{
          backgroundImage: form.coverImage ? `url(${form.coverImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        // onClick={() => fileInputRef.current && fileInputRef.current.click()}
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
        <button
          className="absolute right-8 top-4 flex items-center gap-x-2 rounded bg-white px-2 py-1 text-sm font-semibold text-[#4d4d4d]"
          onClick={() => fileInputRef.current?.click()}
        >
          {/* <Image src="/sparkles.svg" width={20} height={20} alt="sparkles" /> */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3334 8.66663C12.2148 8.66663 11.1676 8.97276 10.2712 9.50576C11.0606 10.4292 11.6846 11.498 12.0977 12.6666H13.3334V8.66663ZM10.6692 12.6666C9.36311 9.53469 6.27197 7.33329 2.66671 7.33329V12.6666H10.6692ZM2.66671 5.99996C5.21947 5.99996 7.54884 6.95649 9.31591 8.53069C10.4698 7.77363 11.8502 7.33329 13.3334 7.33329V1.99996H14.0055C14.3707 1.99996 14.6667 2.29659 14.6667 2.66223V13.3377C14.6667 13.7034 14.3632 14 14.0055 14H1.99457C1.62941 14 1.33337 13.7034 1.33337 13.3377V2.66223C1.33337 2.29647 1.63691 1.99996 1.99457 1.99996H4.00004V0.666626H5.33337V3.33329H2.66671V5.99996ZM12 0.666626V3.33329H6.66671V1.99996H10.6667V0.666626H12ZM11 6.66663C10.4478 6.66663 10 6.21891 10 5.66663C10 5.11434 10.4478 4.66663 11 4.66663C11.5523 4.66663 12 5.11434 12 5.66663C12 6.21891 11.5523 6.66663 11 6.66663Z"
              fill="#4D4D4D"
            />
          </svg>
          {form.coverImage ? "Change Cover" : "Add Cover"}
        </button>
      </div>
    </>
  );
};

export default CoverImage;
