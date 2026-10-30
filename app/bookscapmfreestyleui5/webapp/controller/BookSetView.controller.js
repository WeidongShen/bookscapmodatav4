sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
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
                "author": "Robert Kiyosaki",
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

            var oCtx = oItem.getBindingContext('book');  // oData V4 context
            // Change some properties
            oCtx.setProperty('price', 10000);
            oCtx.setProperty('title', '----- New Title -----');

            // Send to backend (Patch)
            await oModel.submitBatch(sGroupId)
                .then(x => sap.m.MessageToast.show('Updated'))
                .catch(err => sap.m.MessageBox.error(err.message || 'Update Failed'));
        },

        // Event handler for deleting an existing record
        onDeleteSelectedRecord(oEvent) {
            var oModel = this.getView().getModel('book');
            var sGroupId = 'bookcud';
            var oTable = this.byId('idBooksTable');
            var oItem = oTable.getSelectedItem();

            if (!oItem) {
                sap.m.MessageToast.show('Select a book first');
                return;
            }

            var oCtx = oItem.getBindingContext('book');  // oData V4 context

            MessageBox.confirm("Delete selected book?", {
                actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                emphasizedAction: sap.m.MessageBox.Action.DELETE,
                onClose: async (sAction) => {
                    if (sAction !== sap.m.MessageBox.Action.DELETE) return;

                    await oCtx.delete(sGroupId)
                        .then(function () {
                            sap.m.MessageToast.show('Record deleted');
                        })
                        .catch(err => sap.m.MessageBox.error(err.message || 'Delete Failed'));
                }
            })
        },

        async onBatchUpdate() {
            var oModel = this.getView().getModel('book');
            var sGroupId = 'bookcud';
            var oPayload1 = {
                "title": "Book 1",
                "author": "Author 1",
                "price": 2,
                "publishedDate": "2026-01-10T10:30:00Z",
                "gender": "M",
                "ageGroup": "Adult"
            };
            var oPayload2 = {
                "title": "Book 2",
                "author": "Author 2",
                "price": 2,
                "publishedDate": "2026-01-10T10:30:00Z",
                "gender": "M",
                "ageGroup": "Adult"
            };
            var oItemsBinding = this.byId('idBooksTable').getBinding('items');

            oItemsBinding.create(oPayload1, { groupId: sGroupId });
            oItemsBinding.create(oPayload2, { groupId: sGroupId });

            await oModel.submitBatch(sGroupId)
                .then(x => {
                    sap.m.MessageToast.show('Batch Updated');
                })
                .catch(err => {
                    sap.m.MessageBox.error(err.message || 'Batch Update Failed');
                });
        },

        async onCreateFragment() {
            if (!this.oCreateDialog) {
                this.oCreateDialog = await this.loadFragment({
                    name: 'bookscapmfreestyleui5.fragments.createFragment'
                });
                this.getView().addDependent(this.oCreateDialog);
            }
            const oCreateModel = new sap.ui.model.json.JSONModel({
                newBook: {
                    title: '',
                    author: '',
                    price: null,
                    publishedDate: null
                }
            });
            this.getView().setModel(oCreateModel, 'create');

            this.oCreateDialog.open();
        },

        async onSaveBook() {
            const oDataModel = this.getView().getModel('book');
            const oCreateModel = this.getView().getModel('create');
            const oPayload = structuredClone(oCreateModel.getProperty('/newBook'));

            // Basic validation
            if (!oPayload.title || !oPayload.author) {
                sap.m.MessageBox.warning('Title and autor are required');
                return;
            }

            const sGroupId = 'bookcud';

            try {
                const oListBinding = oDataModel.bindList('/BooksSet');
                const oContext = oListBinding.create(oPayload, { groupId: sGroupId });

                await oDataModel.submitBatch(sGroupId)
                    .then(x => {
                        sap.m.MessageToast.show('Book created successfully.');
                        this.oCreateDialog.close();
                        oCreateModel.setProperty("/newBook", { title: '', author: '', price: null, publishedDate: null });
                        this.byId('idBooksTable').getBinding('items').refresh();
                    })
                    .catch(err => {
                        sap.m.MessageBox.error(error?.message || 'Creation Failed');
                    });

            } catch (error) {
                sap.m.MessageBox.error(error?.message || 'Creation Failed');
            }
        },

        onCancelCreate() {
            this.oCreateDialog.close();
        }
    });
});