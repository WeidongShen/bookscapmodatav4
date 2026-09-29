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
            var oCtxBinding = oModel.bindContext(sPath, null, { $expand: 'chapters' });

            var oObj = await oCtxBinding.requestObject();
            var aChapters = (oObj && oObj.chapters) ? oObj.chapters : [];

            this.getView().setModel(new sap.ui.model.json.JSONModel(aChapters), 'ch');
        },

        onItemPress(oEvent) {
            const oCtx = oEvent.getSource().getBindingContext('book');
            const oObj = oCtx.getObject();
            this.getOwnerComponent().getRouter().navTo('RouteBookChaptersView', { ID: oObj.ID });
        },
        // Event handler for creating a new record
        async onCreateNewRecord(oEvent) {
            var oModel = this.getView().getModel('book');
            var sGroupId = 'bookcud';
            var oPayload = {
                "title": "Rich Dad Poor Dad",
                "autor": "Robert Kiyosaki",
                "price": 2,
                "publishedDate": "2026-01-10T10:30:00Z",
                "gender": "M",
                "ageGroup": "Adult"
            };
            var oItemsBinding = this.byId('idBooksTable').getBinding('items');
            oItemsBinding.create(oPayload);
            await oModel.submitBatch(sGroupId)
                .then(x => {
                    oItemsBinding.refresh();  // optional in V4
                })
                .catch(err => {
                    sap.m.MessageBox.error(err.message || 'Create Failed');
                });
        },
        // Event handler for updating an existing record
        async onUpdateSelectedRecord(oEvent) {
            var oModel = this.getView().getModel('book');
            var sGroupId = 'bookcud';
            var oTable = this.byId('idBooksTable');
            var oItem = oTable.getSelectedItem();

            if (!oItem) {
                sap.m.MessageToast.show('Select a book first');
                return;
            }

            var oCtx = oItem.getBindingContext('book');  // oEq5q V4 context
            // Change some properties
            oCtx.setProperty('price', 10000);
            oCtx.setProperty('title', '----- New Title -----');

            // Send to backend (Patch)
            await oModel.submitBatch(sGroupId)
                .then(x => sap.m.MessagToast.show('Updated'))
                .catch(err => sap.m.MessageBox.error(err.message || 'Update Failed'));
        }
    });
});