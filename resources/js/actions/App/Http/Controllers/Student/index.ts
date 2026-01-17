import ClassroomController from './ClassroomController'
import SubjectController from './SubjectController'
import AssessmentController from './AssessmentController'
import AttemptController from './AttemptController'
const Student = {
    ClassroomController: Object.assign(ClassroomController, ClassroomController),
SubjectController: Object.assign(SubjectController, SubjectController),
AssessmentController: Object.assign(AssessmentController, AssessmentController),
AttemptController: Object.assign(AttemptController, AttemptController),
}

export default Student