import Api from './Api'
import Auth from './Auth'
import DashboardController from './DashboardController'
import Student from './Student'
import Instructor from './Instructor'
import Admin from './Admin'
import FileAccessController from './FileAccessController'
import Settings from './Settings'
const Controllers = {
    Api: Object.assign(Api, Api),
Auth: Object.assign(Auth, Auth),
DashboardController: Object.assign(DashboardController, DashboardController),
Student: Object.assign(Student, Student),
Instructor: Object.assign(Instructor, Instructor),
Admin: Object.assign(Admin, Admin),
FileAccessController: Object.assign(FileAccessController, FileAccessController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers