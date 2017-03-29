// /// <reference path="../Entities/NewsItem.ts"/>
// /// <reference path="./INewsRepository.ts"/>

// //import Entities = Delegate.SharePoint.Client.Entities
// import Repositories = Delegate.SharePoint.Client.Repositories
// import NewsItem = Delegate.Force.Entities.NewsItem

// namespace Delegate.Force.Repositories {
//     const PublishStart = "NewsPublishingDate";
//     const ExpirationDate = "NewsExpirationDate";
//     const Created = "Created";

//     export class NewsItemRepository extends Delegate.SharePoint.Client.Repositories.DocumentRepositoryBase<NewsItem> implements Repositories.INewsRepository {

//         constructor(listName: string, ctxService?: Delegate.SharePoint.Client.Services.ISPContext) {
//             super(listName, Entities.NewsItem, ctxService);
//         }

//         getCurrentNews(now: Date, count: number, ctype: string): Promise<Array<NewsItem>> {
//             const queryTemplate =
//                 `<View> 
// 	               <RowLimit>${count}</RowLimit><Query>
//                    <Where>
//                       <And>
//                         <Eq>
//                            <FieldRef Name='_ModerationStatus' />
//                                <Value Type='Modstat'>Approved</Value>
//                         </Eq>
//                         <BeginsWith>
//                             <FieldRef Name='ContentTypeId' />
//                                 <Value Type='TextField'>${ctype}</Value>
//                         </BeginsWith>
//                       </And>
//                    </Where>
//                    <OrderBy>
//                        <FieldRef Name='Created' Ascending='Descending' />
//                    </OrderBy>
//                 </Query></View>`;
//             var query = new SP.CamlQuery();
//             query.set_viewXml(queryTemplate);

//             return this.getByQuery(query);
//         }

//         getNewsByUserContext(now: Date, count: number, ctype: string, functionName: string, regionName: string, countryName: string): Promise<Array<Entities.NewsItem>> {
//             if (!functionName) {
//                 functionName = "Placeholder";
//             }

//             if (!regionName) {
//                 regionName = "Placeholder";
//             }

//             if (!countryName) {
//                 countryName = "Placeholder";
//             }

//             const queryTemplate =
//                 `<View> 
// 	               <RowLimit>${count}</RowLimit><Query>
//                    <Where>
//                       <And>
//                         <Eq>
//                            <FieldRef Name='_ModerationStatus' />
//                                <Value Type='Modstat'>Approved</Value>
//                         </Eq>
//                           <And>
//                              <Or>
//                                 <Eq>
//                                    <FieldRef Name='Function' />
//                                    <Value Type='TaxonomyFieldType'>${functionName}</Value>
//                                 </Eq>
//                                 <IsNull>
//                                    <FieldRef Name='Function' />
//                                 </IsNull>
//                              </Or>
//                              <And>
//                                 <Or>
//                                    <Eq>
//                                       <FieldRef Name='Country' />
//                                       <Value Type='TaxonomyFieldType'>${countryName}</Value>
//                                    </Eq>
//                                    <IsNull>
//                                       <FieldRef Name='Country' />
//                                    </IsNull>
//                                 </Or>
//                                 <Or>
//                                    <Eq>
//                                       <FieldRef Name='Region' />
//                                       <Value Type='TaxonomyFieldType'>${regionName}</Value>
//                                    </Eq>
//                                    <IsNull>
//                                       <FieldRef Name='Region' />
//                                    </IsNull>
//                                 </Or>
//                             </And>
//                           </And>
//                       </And>
//                    </Where>
//                    <OrderBy>
//                        <FieldRef Name='Created' Ascending='Descending' />
//                    </OrderBy>
//                 </Query></View>`;
//             var query = new SP.CamlQuery();
//             query.set_viewXml(queryTemplate);
//             return this.getByQuery(query);

//         }

//         getCurrentNewsByFunction(now: Date, count: number, ctype: string, functionName: string): Promise<Array<Entities.NewsItem>> {
//             const queryTemplate =
//                 `<View> 
// 	               <RowLimit>${count}</RowLimit><Query>
//                    <Where>
//                       <And>
//                         <Eq>
//                            <FieldRef Name='_ModerationStatus' />
//                                <Value Type='Modstat'>Approved</Value>
//                         </Eq>
//                         <And>
//                             <BeginsWith>
//                                 <FieldRef Name='ContentTypeId' />
//                                     <Value Type='TextField'>${ctype}</Value>
//                             </BeginsWith>
//                             <Eq>
//                                 <FieldRef Name='Function' />
//                                     <Value Type='TaxonomyFieldType'>${functionName}</Value>
//                             </Eq>
//                         </And>
//                       </And>
//                    </Where>
//                    <OrderBy>
//                        <FieldRef Name='Created' Ascending='Descending' />
//                    </OrderBy>
//                 </Query></View>`;
//             var query = new SP.CamlQuery();
//             query.set_viewXml(queryTemplate);

//             return this.getByQuery(query);
//         }
//     }
// }
