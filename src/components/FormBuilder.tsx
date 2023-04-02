import Image from "next/image";
import React, { HTMLProps, useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";
import ContentEditable from "react-contenteditable";
import { useDebounceCallback } from "~/hooks/useDelayedRequest";
import { FullFormObject } from "~/models/form";
import { useFormStore } from "~/stores/formStore";
import { useTableStore } from "~/stores/tableStore";
import { api } from "~/utils/api";
import CoverImage from "./CoverImage";
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
    <div className="flex flex-col items-start gap-y-3">
      {" "}
      {winReady && !loading && !!table.id && (
        <Droppable droppableId={"tableFields"}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, false)}
              {...provided.droppableProps}
              className="relative flex flex-col space-y-4"
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
    <div className="flex flex-1 flex-col items-center gap-y-3 ">
      {/* Cover Image */}
      <CoverImage />
      {/* Form SEO/MetaData and Logo */}
      <div className="relative -top-20 -mb-20 min-h-[300px] w-full max-w-xl rounded-md bg-white px-6 pt-10 pb-5">
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
        <Droppable droppableId={"formFields"}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, true)}
              {...provided.droppableProps}
              className="flex flex-col space-y-4"
            >
              {currentForm.fields.map(({ fieldId, index }) => {
                const field = table.fields.find(({ id }) => id === fieldId);

                if (!field) return null;

                return (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getFormFieldStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {field.name}
                        </div>
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

const getTableFieldStyle = (isDragging: boolean, draggableStyle: any) => ({
  ...draggableStyle,
  height: "40px",
  background: "#fff",
  borderRadius: "5px",
  padding: "8px",
  marginBottom: "0px",
  boxShadow: isDragging ? "0 0 1.5rem rgba(0, 0, 0, 0.3)" : "none",
});

const getFormFieldStyle = (isDragging: boolean, draggableStyle: any) => ({
  ...draggableStyle,
  height: "250px",
  background: "#fff",
  borderRadius: "5px",
  padding: "8px",
  marginBottom: "8px",
  boxShadow: isDragging ? "0 0 1.5rem rgba(0, 0, 0, 0.3)" : "none",
});

const getListStyle = (isDraggingOver: boolean, isColumn2: boolean) => ({
  background: isDraggingOver ? "#dcdcdc" : "#F5F5F5",
  padding: "8px",
  width: isColumn2 ? "100%" : "300px",
  flex: isColumn2 ? "1" : "0",
  minHeight: "400px",
  borderRadius: "5px",
  border: "2px dashed transparent",
  borderColor: isDraggingOver ? "gray" : "transparent",
});

const FormBuilder: React.FC = () => {
  const [table] = useTableStore((state) => [state.table]);
  const [form, setFormFields] = useFormStore((state) => [
    state.form,
    state.setFormFields,
  ]);
  const { mutateAsync: editFormFields } = api.form.editFormFields.useMutation();

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
        const newFormFields: FullFormObject["fields"] = [...form.fields];
        newFormFields.splice(destination.index, 0, {
          fieldId: draggableId,
          index: destination.index,
        });
        setFormFields(newFormFields);
        await editFormFields({
          formId: form.id,
          fields: newFormFields.map((field) => field.fieldId),
        });
      }
    } else if (destination.droppableId === "tableFields") {
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
