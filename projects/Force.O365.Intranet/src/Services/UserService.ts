namespace DG.Force.Services {
    export class UserService
    {
        // This function prepares, loads, and then executes a SharePoint query to get the current users information
        public  static getUserName() {
            var context = SP.ClientContext.get_current();
            var user = context.get_web().get_currentUser();
            context.load(user);
            context.executeQueryAsync(function(){
                UserService.onGetUserNameSuccess(user)
            }, UserService.onGetUserNameFail);
        }

        // This function is executed if the above call is successful
        // It replaces the contents of the 'message' element with the user name
        private static onGetUserNameSuccess(user:any) {
            $('#message').text('Hello ' + user.get_title());
        }

        // This function is executed if the above call fails
        private static onGetUserNameFail(sender: any, args: any) {
            alert('Failed to get user name. Error:' + args.get_message());
        }
    }
}