import Image from "next/image";
import { useRef, useState } from "react";
import axios from "axios";
import { useFormStore } from "~/stores/formStore";
import { api } from "~/utils/api";

const CoverImage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
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
      console.log(uploadedImageUrl)

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
        className="flex h-[200px] w-full cursor-pointer items-center justify-center bg-gray-200 transition-colors duration-200 ease-out hover:bg-gray-300"
        style={{
          background: form.coverImage ? `url(${form.coverImage})` : "none",
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
        <div className="-mt-[50px] flex items-center gap-x-2 rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow-black drop-shadow-md">
          <Image src="/sparkles.svg" width={20} height={20} alt="sparkles" />
          {
            form.coverImage ? "Change Cover Image" : "Add Cover Image"
          }
        </div>
      </div>
    </>
  );
};

export default CoverImage;
