var DG;
(function (DG) {
    var Force;
    (function (Force) {
        var Services;
        (function (Services) {
            var NewsService = (function () {
                function NewsService() {
                }
                NewsService.retrieveListItems = function (listName, countryName, locationName, divisionName, rowLimit) {
                    var deferred = jQuery.Deferred();
                    var self = this;
                    var context = SP.ClientContext.get_current();
                    var oList = context.get_web().get_lists().getByTitle(listName);
                    var camlQuery = new SP.CamlQuery();
                    var queryTemplate = "<View> \n\t                <RowLimit>" + rowLimit + "</RowLimit>\n                    <Query>\n                        <Where>\n                            <And>\n                                <And>\n                                    <Eq>\n                                        <FieldRef Name='_ModerationStatus' />\n                                        <Value Type='Modstat'>Approved</Value>\n                                    </Eq>\n                                    <Or>\n                                        <Geq>\n                                            <FieldRef Name='Expires' />\n                                            <Value Type='DateTime'><Today /></Value>\n                                        </Geq>\n                                        <IsNull>\n                                            <FieldRef Name='Expires' />\n                                        </IsNull>\n                                    </Or>\n                                </And>\n                                <Or>\n                                    <Or>\n                                        <Eq>\n                                            <FieldRef Name='Location' />\n                                            <Value Type='TaxonomyFieldType'>" + locationName + "</Value>\n                                        </Eq>\n                                        <Or>\n                                            <Eq>\n                                                <FieldRef Name='Country' />\n                                                <Value Type='TaxonomyFieldType'>" + countryName + "</Value>\n                                            </Eq>\n                                            <Eq>\n                                                <FieldRef Name='Division' />\n                                                <Value Type='TaxonomyFieldType'>" + divisionName + "</Value>\n                                            </Eq>\n                                        </Or>\n                                    </Or>\n                                    <And>\n                                        <IsNull>\n                                            <FieldRef Name='Location' />\n                                        </IsNull>\n                                        <And>\n                                            <IsNull>\n                                                <FieldRef Name='Country' />\n                                            </IsNull>\n                                            <IsNull>\n                                                <FieldRef Name='Division' />\n                                            </IsNull>\n                                        </And>\n                                    </And>\n                                </Or>\n                            </And>\n                        </Where>\n                        <OrderBy>\n                            <FieldRef Name='Created' Ascending='Descending' />\n                            <FieldRef Name='Expires' Ascending='Descending' />\n                        </OrderBy>\n                    </Query>\n                </View>";
                    camlQuery.set_viewXml(queryTemplate);
                    var collListItem = oList.getItems(camlQuery);
                    context.load(oList, "DefaultDisplayFormUrl");
                    context.load(collListItem);
                    context.executeQueryAsync(function () {
                        var html = NewsService.onQuerySucceeded(collListItem, oList);
                        deferred.resolve(html);
                    }, function () {
                        deferred.reject(self);
                    });
                    return deferred.promise();
                };
                NewsService.onQuerySucceeded = function (collListItem, oList) {
                    var listItemInfo = '';
                    var listItemEnumerator = collListItem.getEnumerator();
                    var dispFormUrl = oList.get_defaultDisplayFormUrl();
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        var url = dispFormUrl + "?ID=" + oListItem.get_id() + "&Source=" + window.location.href;
                        var dateObjCreated = new Date(oListItem.get_item('Created'));
                        var title = "<span class=\"ms-textLarge ms-noWrap\">" + oListItem.get_item('Title') + "</span>";
                        if (oListItem.get_item('Important') === true) {
                            title = "<span class='red'>! </span>" + title;
                        }
                        listItemInfo +=
                            "<div class='force-news-item'>\n                        <div class='force-title'>\n                            <a href='" + url + "'>" + title + "</a><br/>\n                            <div class=\"ms-noWrap ms-comm-postBody\">" + dateObjCreated.format("dd-MM-yyyy") + "</div> \n                        </div>\n                    </div>";
                    }
                    if (listItemInfo == '') {
                        listItemInfo = "<div class='force-no-results'>You have no current news items available</div>";
                    }
                    return listItemInfo;
                };
                return NewsService;
            }());
            Services.NewsService = NewsService;
        })(Services = Force.Services || (Force.Services = {}));
    })(Force = DG.Force || (DG.Force = {}));
})(DG || (DG = {}));
