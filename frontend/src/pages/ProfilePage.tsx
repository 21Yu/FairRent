import Layout from "../components/layout/Layout";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function ProfilePage() {
    return (
        <Layout>
            <div className="p-8 md:p-4 flex flex-col md:flex-row">
                <LoginForm/>
                <RegisterForm/>
            </div>
        </Layout>
    );
}