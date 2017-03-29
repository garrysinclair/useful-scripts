var DG;
(function (DG) {
    var Force;
    (function (Force) {
        var Services;
        (function (Services) {
            var NewsService = (function () {
                function NewsService() {
                }
                NewsService.retrieveListItems = function () {
                    var context = SP.ClientContext.get_current();
                    var oList = context.get_web().get_lists().getByTitle('Global News');
                    var camlQuery = new SP.CamlQuery();
                    camlQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
                        '<Value Type=\'Number\'>1</Value></Geq></Where></Query><RowLimit>10</RowLimit></View>');
                    var collListItem = oList.getItems(camlQuery);
                    context.load(collListItem);
                    context.executeQueryAsync(function () { this.onQuerySucceeded(collListItem); }, this.onQueryFailed);
                };
                NewsService.onQuerySucceeded = function (collListItem) {
                    var listItemInfo = '';
                    var listItemEnumerator = collListItem.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        listItemInfo += '\nID: ' + oListItem.get_id() +
                            '\nTitle: ' + oListItem.get_item('Title') +
                            '\nBody: ' + oListItem.get_item('Body');
                    }
                    alert(listItemInfo.toString());
                };
                NewsService.onQueryFailed = function (sender, args) {
                    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                };
                return NewsService;
            }());
            Services.NewsService = NewsService;
        })(Services = Force.Services || (Force.Services = {}));
    })(Force = DG.Force || (DG.Force = {}));
})(DG || (DG = {}));
//# sourceMappingURL=NewsService.js.map