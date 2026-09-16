sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("bookscapmfreestyleui5.controller.BookSetView", {
        onInit() {
            var oDataModel = this.getOwnerComponent().getModel();    // OData V4
            this.getView().setModel(oDataModel, 'book');

            // Filters
            var oTable = this.getView().byId('idBooksTable');
            var oBinding = oTable.getBinding('items');
            var oFilters = [
                new sap.ui.model.Filter('price', 'LT', 10)
            ];
            oBinding.filter(oFilters);
            // Sorters
            var oSorter = new sap.ui.model.Sorter('price', true);
            oBinding.sort(oSorter);
        }
    });
});