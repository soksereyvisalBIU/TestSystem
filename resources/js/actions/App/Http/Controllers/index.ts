import Api from './Api'
import Auth from './Auth'
import DashboardController from './DashboardController'
import Instructor from './Instructor'
import Student from './Student'
import FileAccessController from './FileAccessController'
import Settings from './Settings'
const Controllers = {
    Api: Object.assign(Api, Api),
Auth: Object.assign(Auth, Auth),
DashboardController: Object.assign(DashboardController, DashboardController),
Instructor: Object.assign(Instructor, Instructor),
Student: Object.assign(Student, Student),
FileAccessController: Object.assign(FileAccessController, FileAccessController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers