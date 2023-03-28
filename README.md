airtable APIs:

get bases
GET https://api.airtable.com/v0/meta/bases

get baseschema
GET https://api.airtable.com/v0/meta/bases/{baseId}/tables

create field
POST https://api.airtable.com/v0/meta/bases/{baseId}/tables/{tableId}/fields
{
id,type,name,description,options
}

---

getBases -> get bases under user account
editBase{baseId} -> edit a base's settings etc

getTables{baseId} -> get tables under base (id, name, desc)
getTable{tableId} -> get entire table data ( fields id, and form ids included )
editTable{tableId} -> edit a table's settings etc

getForms{tableId} -> use getTable instead
getForm{formId} -> get form deets
createForm{tableId} -> create a form on a table
editForm{formId} -> edit a form
deleteForm{formId} -> delete the form

getFields{tableId} -> get fields on a certain table
getFields{formId} -> get fields on a certain form
createField{tableId} -> create a field on a table

---
