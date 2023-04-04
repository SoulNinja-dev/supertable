import classNames from "classnames";
import Image from "next/image";
import React, { HTMLProps, useEffect, useMemo, useRef, useState } from "react";
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
import TableField from "./TableField";

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
    <div className="flex flex-col items-start gap-y-3 h-full">
      {" "}
      {winReady && !loading && !!table.id && (
        <Droppable droppableId={"tableFields"}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              // style={getListStyle(snapshot.isDraggingOver, false)}
              {...provided.droppableProps}
              className={classNames({
                "relative flex w-[300px] flex-col space-y-4 py-2 px-4 min-h-[100%]": true,
                "bg-[#ededed]": snapshot.isDraggingOver,
                "bg-[#f5f5f5]": !snapshot.isDraggingOver,
              })}
            >
              {table.fields
                .filter(({ id }) => !formFields.includes(id))
                .map(({ id, name, type, options }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => {
                        return (
                          <TableField
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getTableFieldStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                            className={classNames({
                              "border-2 border-dashed border-gray-800 bg-[#f3f2f2]":
                                snapshot.isDragging,
                            })}
                            type={type}
                            name={name}
                          />
                        );
                      }}
                    </Draggable>
                  );
                })}

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

  useEffect(() => {
    setwinReady(true);
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto bg-[#fff]/40 pb-16">
      <div className="flex flex-1 flex-col items-center gap-y-3">
        {/* Cover Image */}
        <CoverImage />
        {/* Form SEO/MetaData and Logo */}
        <div className="relative -top-20 -mb-20 min-h-[300px] w-full max-w-lg rounded-md bg-white px-6 pt-10 pb-5">
          <div className="flex max-w-[200px] cursor-pointer justify-center gap-x-2 rounded-xl border-2 border-dashed border-gray-300 px-3 py-6 text-gray-400 transition-colors duration-[50ms] ease-out hover:bg-gray-100">
            <Image src="/sparkles.svg" width={20} height={20} alt="sparkles" />
            Add a Logo
          </div>
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
          <div className="min-h-[150px] w-full px-4">
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
      </div>
      <FormSettings />
    </div>
  );
};

const getTableFieldStyle = (isDragging: boolean, draggableStyle: any) => ({
  ...draggableStyle,
  height: "40px",
  background: "#fff",
  borderRadius: "2px",
  padding: "8px",
  marginBottom: "0px",
  border: isDragging ? "1px solid #ccc" : "none",
});

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
  const { mutateAsync: editFormFields } = api.form.editFormFieldsOrder.useMutation();

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
      <div className="flex h-full bg-sidebar">
        <TableFieldsColumn />

        <FormFieldsColumn />
      </div>
    </DragDropContext>
  );
};

export default FormBuilder;
