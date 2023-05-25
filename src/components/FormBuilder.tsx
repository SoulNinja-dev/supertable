import classNames from "classnames";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";
import ContentEditable from "react-contenteditable";
import useClickOutside from "use-click-outside";
import { useDebounceCallback } from "~/hooks/useDelayedRequest";
import { FullFormObject } from "~/models/form";
import { useFormStore } from "~/stores/formStore";
import { useTableStore } from "~/stores/tableStore";
import { api } from "~/utils/api";
import CoverImage from "./CoverImage";
import FormField from "./FormField";
import FormSettings from "./FormSettings";
import LogoImage from "./LogoImage";
import TableField from "./TableField";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import FormPreview from "./FormPreview";

resetServerContext();

export const TableFieldsColumn: React.FC = () => {
  const [table, loading] = useTableStore((state) => [
    state.table,
    state.loading,
  ]);
  const [currentForm] = useFormStore((state) => [state.form]);
  const formFields = useMemo(
    () => currentForm.fields.map((field) => field.fieldId),
    [currentForm.fields]
  );

  const [winReady, setwinReady] = useState(false);

  useEffect(() => {
    setwinReady(true);
  }, []);

  return (
    <div className="flex h-full flex-col items-start gap-3 py-5 px-5 font-manrope w-[350px]">
      <div className="rounded-md bg-[#f2f2f2] py-0.5 px-2 text-sm font-semibold text-[#666666]">
        &larr; Back
      </div>
      <div className="text-xl font-bold">Available Fields</div>
      <div className="text-sm font-semibold text-[#4d4d4d]">
        Drag & drop fields from the available fields from here.
      </div>
      {winReady && !loading && !!table.id && (
        <Droppable droppableId={"tableFields"}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              // style={getListStyle(snapshot.isDraggingOver, false)}
              {...provided.droppableProps}
              className={classNames({
                "relative flex flex-row flex-wrap gap-3 max-w-[220px]": true,
                "bg-gray-100": snapshot.isDraggingOver,
                "bg-white": !snapshot.isDraggingOver,
              })}
            >
              {table.fields.filter(({ id }) => !formFields.includes(id))
                .length > 0 ? (
                table.fields
                  .filter(
                    ({ id, name, type }) =>
                      !formFields.includes(id) && name !== "solana-addr" && type !== "multipleLookupValues"
                  )
                  .map(({ id, name, type, options }, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided, snapshot) => {
                          return (
                            <TableField
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              // style={getTableFieldStyle(
                              //   snapshot.isDragging,
                              //   provided.draggableProps.style
                              // )}
                              // className={classNames({
                              //   "border-2 border-dashed border-gray-800 bg-[#f3f2f2]":
                              //     snapshot.isDragging,
                              //   "bg-transparent": !snapshot.isDragging,
                              // })}
                              type={type}
                              name={name}
                            />
                          );
                        }}
                      </Draggable>
                    );
                  })
              ) : (
                <div className="text-sm font-medium">
                  No form fields available
                </div>
              )}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export const FormFieldsColumn: React.FC = () => {
  const [winReady, setwinReady] = useState(false);
  const [currentForm, setForm] = useFormStore((state) => [
    state.form,
    state.setForm,
  ]);
  const debounceFormTitleSet = useDebounceCallback(500);
  const debounceFormDescriptionSet = useDebounceCallback(500);
  const { data: newCurrentForm, mutateAsync } = api.form.editForm.useMutation();
  const [updateTableForm] = useTableStore((state) => [state.updateTableForm]);
  const [table] = useTableStore((state) => [state.table]);
  const [currentTab, setCurrentTab] = useFormBuilderStore((s) => [
    s.currentTab,
    s.setCurrentTab,
  ]);

  useEffect(() => {
    setwinReady(true);
  }, []);

  return (
    <div className="col-span-3 h-full w-full overflow-y-scroll bg-[#fff]/40">
      <div className="flex flex-row items-center justify-center gap-4 py-4">
        <div
          className={classNames(
            "flex flex-row items-center gap-1 py-0.5 px-1 font-semibold cursor-pointer",
            {
              "border-b-[3px] border-[#5522df]": currentTab === "form",
              "border-b-[3px] border-[#d9d9d9]": currentTab !== "form",
            }
          )}
          onClick={() => setCurrentTab("form")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 1.33337V2.66671H13.3377C13.7035 2.66671 14 2.96334 14 3.32897V14.0044C14 14.3702 13.7034 14.6667 13.3377 14.6667H2.66227C2.29651 14.6667 2 14.3701 2 14.0044V3.32897C2 2.96321 2.29663 2.66671 2.66227 2.66671H4.66667V1.33337H11.3333ZM4.66667 4.00004H3.33333V13.3334H12.6667V4.00004H11.3333V5.33337H4.66667V4.00004ZM6 10.6667V12H4.66667V10.6667H6ZM6 8.66671V10H4.66667V8.66671H6ZM6 6.66671V8.00004H4.66667V6.66671H6ZM10 2.66671H6V4.00004H10V2.66671Z"
              fill={currentTab === "form" ? "#5522df" : "#404040"}
            />
          </svg>
          Form Creation
        </div>
        <div
          className={classNames(
            "flex flex-row items-center gap-1 py-0.5 px-1 font-semibold cursor-pointer",
            {
              "border-b-[3px] border-[#5522df]": currentTab === "settings",
              "border-b-[3px] border-[#d9d9d9]": currentTab !== "settings",
            }
          )}
          onClick={() => setCurrentTab("settings")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.22631 11.3335C1.93814 10.8344 1.72185 10.3135 1.57422 9.78277C2.22253 9.45197 2.66648 8.77791 2.66648 8.00017C2.66648 7.22304 2.2232 6.54937 1.57569 6.21831C1.8735 5.14438 2.43905 4.14422 3.24316 3.32671C3.8538 3.72281 4.65957 3.77027 5.33315 3.38137C6.00673 2.99248 6.36851 2.27094 6.3308 1.54407C7.44087 1.25644 8.5898 1.26673 9.66873 1.54579C9.63167 2.27208 9.9934 2.99279 10.6665 3.38137C11.3401 3.77025 12.1458 3.72281 12.7564 3.32675C13.1422 3.71995 13.4851 4.16771 13.7733 4.66685C14.0615 5.16597 14.2778 5.68687 14.4254 6.21756C13.7771 6.54835 13.3331 7.22244 13.3331 8.00017C13.3331 8.77737 13.7764 9.45097 14.4239 9.78204C14.1261 10.856 13.5606 11.8561 12.7565 12.6736C12.1458 12.2776 11.3401 12.2301 10.6665 12.619C9.99287 13.0078 9.63113 13.7294 9.6688 14.4563C8.5588 14.7439 7.40987 14.7336 6.33089 14.4546C6.36794 13.7282 6.00619 13.0076 5.33315 12.619C4.65959 12.2301 3.85386 12.2775 3.24323 12.6736C2.85745 12.2804 2.51448 11.8326 2.22631 11.3335ZM5.99981 11.4643C6.7274 11.8844 7.24993 12.5485 7.5002 13.3106C7.8324 13.3422 8.1668 13.3427 8.49907 13.3117C8.7492 12.5492 9.27187 11.8846 9.9998 11.4643C10.7277 11.044 11.5647 10.9237 12.3501 11.0883C12.5431 10.816 12.7099 10.5262 12.8486 10.2227C12.3137 9.62491 11.9998 8.84031 11.9998 8.00017C11.9998 7.16004 12.3137 6.37551 12.8486 5.77771C12.7792 5.62704 12.7025 5.47885 12.6186 5.33351C12.5347 5.18817 12.4447 5.04769 12.3489 4.91232C11.5638 5.07655 10.7274 4.95613 9.9998 4.53607C9.2722 4.11601 8.74973 3.45183 8.4994 2.68974C8.16727 2.65813 7.8328 2.65768 7.5006 2.68865C7.2504 3.45118 6.72773 4.1158 5.99981 4.53607C5.27187 4.95635 4.43497 5.07667 3.64952 4.91206C3.45657 5.18431 3.28975 5.47415 3.15104 5.77762C3.68587 6.37545 3.99981 7.16004 3.99981 8.00017C3.99981 8.84031 3.68589 9.62484 3.15104 10.2226C3.22045 10.3733 3.29709 10.5215 3.38101 10.6668C3.46493 10.8122 3.55493 10.9526 3.65075 11.088C4.43585 10.9238 5.27225 11.0442 5.99981 11.4643ZM7.9998 10.0002C6.89527 10.0002 5.99981 9.10477 5.99981 8.00017C5.99981 6.89564 6.89527 6.00018 7.9998 6.00018C9.1044 6.00018 9.9998 6.89564 9.9998 8.00017C9.9998 9.10477 9.1044 10.0002 7.9998 10.0002ZM7.9998 8.66684C8.368 8.66684 8.66647 8.36837 8.66647 8.00017C8.66647 7.63197 8.368 7.33351 7.9998 7.33351C7.6316 7.33351 7.33313 7.63197 7.33313 8.00017C7.33313 8.36837 7.6316 8.66684 7.9998 8.66684Z"
              fill={currentTab === "settings" ? "#5522df" : "#404040"}
            />
          </svg>
          Form Settings
        </div>
        <div
          className={classNames(
            "flex flex-row items-center gap-1 py-0.5 px-1 font-semibold cursor-pointer",
            {
              "border-b-[3px] border-[#5522df]": currentTab === "preview",
              "border-b-[3px] border-[#d9d9d9]": currentTab !== "preview",
            }
          )}
          onClick={() => setCurrentTab("preview")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00016 2C11.5949 2 14.5856 4.58651 15.2126 8C14.5856 11.4135 11.5949 14 8.00016 14C4.40537 14 1.41473 11.4135 0.78772 8C1.41473 4.58651 4.40537 2 8.00016 2ZM8.00016 12.6667C10.8239 12.6667 13.2402 10.7013 13.8518 8C13.2402 5.29869 10.8239 3.33333 8.00016 3.33333C5.17636 3.33333 2.76011 5.29869 2.14848 8C2.76011 10.7013 5.17636 12.6667 8.00016 12.6667ZM8.00016 11C6.34328 11 5.00013 9.65687 5.00013 8C5.00013 6.34315 6.34328 5 8.00016 5C9.65696 5 11.0002 6.34315 11.0002 8C11.0002 9.65687 9.65696 11 8.00016 11ZM8.00016 9.66667C8.92063 9.66667 9.66683 8.92047 9.66683 8C9.66683 7.07953 8.92063 6.33333 8.00016 6.33333C7.07969 6.33333 6.33347 7.07953 6.33347 8C6.33347 8.92047 7.07969 9.66667 8.00016 9.66667Z"
              fill={currentTab === "preview" ? "#5522df" : "#404040"}
            />
          </svg>
          Form Preview
        </div>
      </div>
      {currentTab === "form" && <div className="flex flex-1 flex-col items-center gap-y-3">
        {/* Cover Image */}
        <CoverImage />
        {/* Form SEO/MetaData and Logo */}
        <div className="relative -top-20 -mb-20 min-h-[300px] w-full max-w-lg rounded-md border bg-white px-6 pt-10 pb-5">
          <LogoImage />
          <ContentEditable
            onChange={(e) => {
              if (e.currentTarget.innerText === currentForm.title) return;
              if (currentForm.id)
                debounceFormTitleSet(async () => {
                  mutateAsync({
                    formId: currentForm.id,
                    title: e.currentTarget.innerText,
                  });
                  setForm({
                    ...currentForm,
                    title: e.currentTarget.innerText,
                  });
                  updateTableForm({
                    id: currentForm.id,
                    title: e.currentTarget.innerText,
                  });
                });
            }}
            className="mt-4 w-full px-4 py-2 text-3xl font-semibold text-gray-500 transition-colors duration-200 ease-out hover:bg-gray-200/80 focus:bg-gray-200/60 focus:outline-gray-400/50"
            html={currentForm.title || ""}
          />
          <ContentEditable
            onChange={(e) => {
              if (e.currentTarget.innerText === currentForm.description) return;
              if (currentForm.id)
                debounceFormDescriptionSet(async () => {
                  mutateAsync({
                    formId: currentForm.id,
                    description: e.currentTarget.innerText,
                  });
                  setForm({
                    ...currentForm,
                    description: e.currentTarget.innerText,
                  });
                });
            }}
            className="mt-1 w-full px-4 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 ease-out hover:bg-gray-200/80 focus:bg-gray-200/60 focus:outline-gray-400/50"
            html={currentForm.description || ""}
          />
        </div>

        {/* {winReady && children} */}
        {winReady && (
          <div className="min-h-[150px] w-full px-24 pt-10 pb-60">
            <Droppable droppableId={"formFields"}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  // style={{
                  //   ...getListStyle(
                  //     snapshot.isDraggingOver,
                  //     true,
                  //     currentForm?.fields?.length === 0
                  //   ),
                  //   // height: "200",
                  // }}
                  id="cat"
                  {...provided.droppableProps}
                  className={classNames({
                    "relative flex h-full w-full flex-1 flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed p-2":
                      true,

                    "bg-[#ededed]": snapshot.isDraggingOver,
                    // "bg-[#fff]/50": !snapshot.isDraggingOver,
                    "border-[#aeaeae]":
                      snapshot.isDraggingOver ||
                      currentForm.fields.length === 0,
                    "border-transparent":
                      !snapshot.isDraggingOver &&
                      currentForm.fields.length !== 0,
                  })}
                >
                  {currentForm.fields.length
                    ? currentForm.fields.map((formField, index) => {
                        const field = table.fields.find(
                          ({ id }) => id === formField.fieldId
                        );

                        if (!field) return null;

                        return (
                          <Draggable
                            key={field.id}
                            draggableId={field.id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <FormField
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getFormFieldStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                  field={field}
                                  formField={formField}
                                  isDragging={snapshot.isDragging}
                                  key={field.id}
                                />
                              );
                            }}
                          </Draggable>
                        );
                      })
                    : !snapshot.isDraggingOver && (
                        <div className="text-xl text-gray-400">
                          Drop Fields Here
                        </div>
                      )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </div>}
        {
          currentTab === "settings" && <FormSettings/>
        }
        {
          currentTab === "preview" && <p className="text-center pt-32">
            <FormPreview />
          </p>
        }
    </div>
  );
};


const getFormFieldStyle = (isDragging: boolean, draggableStyle: any) => ({
  ...draggableStyle,
  borderRadius: "5px",
  padding: "8px",
  marginBottom: "8px",
});

const FormBuilder: React.FC = () => {
  const [table] = useTableStore((state) => [state.table]);
  const [form, setFormFields] = useFormStore((state) => [
    state.form,
    state.setFormFields,
  ]);
  const { mutateAsync: editFormFields } =
    api.form.editFormFieldsOrder.useMutation();

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // No rearranging inside tableFields column
    if (
      destination.droppableId === "tableFields" &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Table fields column --> Form fields column
    if (destination.droppableId === "formFields") {
      if (source.droppableId === "formFields") {
        // Rearranging form fields
        const newFormFields: FullFormObject["fields"] = [...form.fields];
        const [removed] = newFormFields.splice(source.index, 1);
        newFormFields.splice(
          destination.index,
          0,
          removed as FullFormObject["fields"][0]
        );
        setFormFields(newFormFields);
        await editFormFields({
          formId: form.id,
          fields: newFormFields.map((field) => field.fieldId),
        });
      } else {
        // Adding form field
        const newFormFields: FullFormObject["fields"] = [...form.fields];
        newFormFields.splice(destination.index, 0, {
          fieldId: draggableId,
          index: destination.index,
          required: false,
          helpText: "",
        });
        setFormFields(newFormFields);
        await editFormFields({
          formId: form.id,
          fields: newFormFields.map((field) => field.fieldId),
        });
      }
    } else if (destination.droppableId === "tableFields") {
      // Remove from form fields
      const newFormFields: FullFormObject["fields"] = [...form.fields];
      const [removed] = newFormFields.splice(source.index, 1);
      setFormFields(newFormFields);
      await editFormFields({
        formId: form.id,
        fields: newFormFields.map((field) => field.fieldId),
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className=" h-[calc(100vh-64px)] flex  divide-x divide-[#d9d9d9] bg-white">
        <TableFieldsColumn />
        <FormFieldsColumn />
      </div>
    </DragDropContext>
  );
};

export default FormBuilder;
