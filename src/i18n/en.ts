export default {
  title: "Kongsi Inventory",
  label: {
    email: "Email",
    password: "Password",
    login: "Login",
    logout: "Logout",
    populate: "Populate",
    submit: "Submit",
    done: "Done",
    update: "Update",
    delete: "Delete",
    product: {
      name: "Product Name",
      price: "Price",
      supplier: "Supplier",
      sortBy: "Sort By",
      sortByList: {
        idAsc: "ID (Oldest first)",
        idDesc: "ID (Newest first)",
        nameAsc: "Name (A-Z)",
        nameDesc: "Name (Z-A)",
        priceAsc: "Price (Lowest first)",
        priceDesc: "Price (Highest first)",
      },
    },
    userRoles: {
      name: "Role Name",
      permissions: "Permissions",
      target: "Target",
      product: {
        title: "Product",
        canAdd: "Add",
        canView: "View",
        canEdit: "Update",
        canDelete: "Delete",
      },
    },
    supplier: {
      name: "Supplied by",
    },
    nav: {
      drawer: {
        inventory: "Inventory",
        newProduct: "New Product",
        userRoles: "Roles",
        newUserRoles: "New Roles",
      },
      breadcrumb: {
        inventory: "Inventory",
        product: "Product",
        newProduct: "New Product",
        roles: "Roles",
        newRoles: "New Roles",
      },
    },
    dialog: {
      confirmDelete: "Are you sure you want to delete?",
      yes: "Yes",
      no: "No",
    },
    mode: {
      admin: "Admin",
      guest: "Guest",
    },
    table: {
      empty: "No data found.",
    },
  },
  heading: {
    create: {
      product: "New product",
    },
  },
  credit: {
    creator: "Kongsi Corporation",
  },
  error: {
    general: "Something went wrong. Please try again.",
    invalidEmail: "Please enter a valid email.",
    invalidPassword: "Please enter a password.",
    invalidCredentials: "Invalid email/password.",
    insufficientPrivilege:
      "You don't have the privilege to perform this action.",
    insufficientPrivilegeProduct: {
      canAddProduct: "You don't have the privilege to add products.",
      canViewProduct: "You don't have the privilege to view products.",
      canEditProduct: "You don't have the privilege to edit products.",
      canDeleteProduct: "You don't have the privilege to delete products.",
    },
    http: {
      internalServer: "Something went wrong. Please try again.",
      badRequest: "Operation error.",
      notFound: "The item couldn't be found.",
      unauthorized: "You're not allowed to perform this action.",
    },
    session: {
      expired: "Your session has expired. Please log in again.",
    },
    input: {
      addProduct: {
        nameRequired: "Name is required",
        priceRequired: "Price is required",
        supplierRequired: "Supplier is required",
      },
      addUserRoles: {
        nameRequired: "Name is required",
      },
    },
  },
};
