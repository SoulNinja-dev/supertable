import Image from "next/image";
import { useFormStore } from "~/stores/formStore";
import { useTableStore } from "~/stores/tableStore";
import { isProperSlug } from "~/utils/misc";

const FormPreview: React.FC = () => {
  const [slug] = useFormStore((s) => [s.form.slug]);
  const [customDomain] = useTableStore((s) => [s.table.customDomain]);

  const devPort =
    process.env.NODE_ENV === "development" ? `.localhost:3000` : "";

  const slugValidationError = slug && isProperSlug(slug);
  const isSlugValid = slug && !slugValidationError;
  const isCustomDomainValid = customDomain && isDomainValid(customDomain);

  console.log(slug, customDomain, isSlugValid, isCustomDomainValid);

  return (
    <div className="flex w-full justify-center">
      {isSlugValid && isCustomDomainValid && (
        <a
          href={`https://${customDomain}${devPort}/${slug}`}
          target="_blank"
          rel="noreferrer"
        >
          <button className="flex items-center gap-x-2 rounded-lg bg-black px-4 py-2 font-medium text-white">
            <span>Open Preview</span>
            <Image
              src="/external-link.svg"
              alt="external link"
              width={22}
              height={22}
              className="text-white"
            />
          </button>
        </a>
      )}
      {!isSlugValid && (
        <div className="text-red-500 font-semibold max-w-[400px] px-10">
          <span>Slug Validation {slugValidationError}</span>
        </div>
      )}
      {!isCustomDomainValid && (
        <div className="text-red-500 font-semibold">
          <span>Custom domain is not valid!</span>
          </div>
      )}
    </div>
  );
};

const isDomainValid = (domain: string) => {
  const domainRegEx =
    /^(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]|(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]{1,5})?)$/i;
  return domainRegEx.test(domain);
};

export default FormPreview;
