sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("bookscapmfreestyleui5.controller.BookChaptersView", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute('RouteBookChaptersView')
            .attachPatternMatched(this.onObjMatched, this);
        },
        onObjMatched(oEvent) {
            const bookid = oEvent.getParameter('arguments').ID;
            var sPath = `/BooksSet(ID=${bookid})`;
            this.getView().bindElement({
                path : sPath,
                parameters : {
                    $expand : 'chapters'
                }
            });
        }
    });
});