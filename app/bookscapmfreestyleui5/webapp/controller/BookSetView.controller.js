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
        },
        // Event handler for show chapters
        async _showChapters(oEvent) {
            var oModel = this.getView().getModel('book');
            var oBookContext = oEvent.getParameter('listItem').getBindingContext('book');

            if (!oBookContext) return;
            var sId = oBookContext.getProperty('ID');
            var sPath = `/BooksSet(ID=${sId})`;
            // bind context with expand
            var oCtxBinding = oModel.bindContext(sPath, null, {$expand : 'chapters'});

            var oObj =await oCtxBinding.requestObject();
            var aChapters = (oObj && oObj.chapters) ? oObj.chapters : [];

            this.getView().setModel(new sap.ui.model.json.JSONModel(aChapters), 'ch');
        },

        onItemPress(oEvent) {
            const oCtx = oEvent.getSource().getBindingContext('book');
            const oObj = oCtx.getObject();
            this.getOwnerComponent().getRouter().navTo('RouteBookChaptersView', {ID : oObj.ID});
        }
    });
});