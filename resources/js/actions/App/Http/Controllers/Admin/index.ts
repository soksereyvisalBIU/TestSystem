import UserManagementController from './UserManagementController'
import SystemAdministratorController from './SystemAdministratorController'
const Admin = {
    UserManagementController: Object.assign(UserManagementController, UserManagementController),
SystemAdministratorController: Object.assign(SystemAdministratorController, SystemAdministratorController),
}

export default Admin