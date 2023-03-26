user in airtable has these:

- authdeck
  - userform
  - contributor form
  - member form
- supertable
  - userform
  - review form
  - subscriber form

oauth -> access to only authdeck base

to add access to supertable
-> signIn("airtable")
-> everytime we pull data for dashboard

- check what bases we have access to
- store base id and other data WE need ( theme, seo )
- user -> bases

_after user gives access to supertable after doing oauth again_

-> we pull data for airtable
-> make new baseid and get forms from supertable
-> AND also have authdeck filled

_if user removes access to authdeck_

- we pull data from airtable
- see that authdeck was NOT there
- hidden:true
