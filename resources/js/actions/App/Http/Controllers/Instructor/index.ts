import ClassroomController from './ClassroomController'
import SubjectController from './SubjectController'
import AssessmentController from './AssessmentController'
import QuestionController from './QuestionController'
import StudentController from './StudentController'
const Instructor = {
    ClassroomController: Object.assign(ClassroomController, ClassroomController),
SubjectController: Object.assign(SubjectController, SubjectController),
AssessmentController: Object.assign(AssessmentController, AssessmentController),
QuestionController: Object.assign(QuestionController, QuestionController),
StudentController: Object.assign(StudentController, StudentController),
}

export default Instructor