namespace DG.Force.Services {

    export class NewsService {

        public static retrieveListItems(listName:string, countryName:string, locationName:string, 
        divisionName:string, rowLimit:number) : JQueryPromise<string> {

            var deferred = jQuery.Deferred <string>();
            var self = this;

            var context = SP.ClientContext.get_current();
            var oList = context.get_web().get_lists().getByTitle(listName);
                
            var camlQuery = new SP.CamlQuery();
            
            const queryTemplate = 
                `<View> 
	                <RowLimit>${rowLimit}</RowLimit>
                    <Query>
                        <Where>
                            <And>
                                <And>
                                    <Eq>
                                        <FieldRef Name='_ModerationStatus' />
                                        <Value Type='Modstat'>Approved</Value>
                                    </Eq>
                                    <Or>
                                        <Geq>
                                            <FieldRef Name='Expires' />
                                            <Value Type='DateTime'><Today /></Value>
                                        </Geq>
                                        <IsNull>
                                            <FieldRef Name='Expires' />
                                        </IsNull>
                                    </Or>
                                </And>
                                <Or>
                                    <Or>
                                        <Eq>
                                            <FieldRef Name='Location' />
                                            <Value Type='TaxonomyFieldType'>${locationName}</Value>
                                        </Eq>
                                        <Or>
                                            <Eq>
                                                <FieldRef Name='Country' />
                                                <Value Type='TaxonomyFieldType'>${countryName}</Value>
                                            </Eq>
                                            <Eq>
                                                <FieldRef Name='Division' />
                                                <Value Type='TaxonomyFieldType'>${divisionName}</Value>
                                            </Eq>
                                        </Or>
                                    </Or>
                                    <And>
                                        <IsNull>
                                            <FieldRef Name='Location' />
                                        </IsNull>
                                        <And>
                                            <IsNull>
                                                <FieldRef Name='Country' />
                                            </IsNull>
                                            <IsNull>
                                                <FieldRef Name='Division' />
                                            </IsNull>
                                        </And>
                                    </And>
                                </Or>
                            </And>
                        </Where>
                        <OrderBy>
                            <FieldRef Name='Created' Ascending='Descending' />
                            <FieldRef Name='Expires' Ascending='Descending' />
                        </OrderBy>
                    </Query>
                </View>`
            camlQuery.set_viewXml(queryTemplate);

            var collListItem = oList.getItems(camlQuery);
                
            context.load(oList, "DefaultDisplayFormUrl");
            context.load(collListItem);
                
            context.executeQueryAsync(function(){
                var html = NewsService.onQuerySucceeded(collListItem, oList);
                deferred.resolve(html);
            }, function () {
                deferred.reject(self);
            }); 

             return deferred.promise();
        }

        private static onQuerySucceeded(collListItem:any, oList:any) : string {

            var listItemInfo = '';

            var listItemEnumerator = collListItem.getEnumerator();
                
            var dispFormUrl = oList.get_defaultDisplayFormUrl();
                
            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                var url = `${dispFormUrl}?ID=${oListItem.get_id()}&Source=${window.location.href}`
                var dateObjCreated = new Date(oListItem.get_item('Created'));
                
                var title = `<span class="ms-textLarge ms-noWrap">${oListItem.get_item('Title')}</span>`;
                if (oListItem.get_item('Important') === true){
                    title = `<span class='red'>! </span>${title}`;
                }

                listItemInfo += 
                    `<div class='force-news-item'>
                        <div class='force-title'>
                            <a href='${url}'>${title}</a><br/>
                            <div class="ms-noWrap ms-comm-postBody">${dateObjCreated.format("dd-MM-yyyy")}</div> 
                        </div>
                    </div>`;
            }

            if(listItemInfo == ''){
                listItemInfo = `<div class='force-no-results'>You have no current news items available</div>`;
            }

            return listItemInfo;
        }
    }

}