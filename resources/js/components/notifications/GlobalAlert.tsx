// import Echo from 'laravel-echo';
import echo from '@/echo';
import { useAuth } from '@/hooks/useAuth';
// import { useAuth } from '@/hooks/useAuth';


import { useEffect } from 'react';
import toast from 'react-hot-toast';

const GlobalAlert = () => {
    const notify = (type: string, msg: string) => {
        switch (type) {
            case 'success':
                toast.success(msg);
                break;
            case 'error':
                toast.error(msg);
                break;
            case 'warning':
                toast(msg, { icon: '⚠️' });
                break;
            default:
                toast(msg, { icon: '📢' });
        }
    };

    // const { auth } = usePage().props;
    const auth = useAuth();
    const courses = auth?.courses;
    useEffect(() => {

        echo.channel('global.notifications').listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (e) => {
            console.log('Received:', e);
            toast.success(`"Received:", ${e}`);
        });

        courses.forEach((course: any) => {
            echo.private(`course.${course.course_id}`).listen('CourseUpdated', (e: any) => {
                notify(e.type, `${e.course.name} ${e.message}`);
                // console.log(e);
            });
        });



        return () => {
            courses.forEach((course: any) => {
                echo.leave(`course.${course.course_id}`);
            });
        };
    }, [courses]);

    return null; // this is just a listener, no UI until an alert comes
};

export default GlobalAlert;
