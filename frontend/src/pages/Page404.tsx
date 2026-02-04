import { Link } from "react-router-dom";

const Page404 = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-1">404</h1>
            <p className="lead">אופס הדף שאתה מחפש לא קיים</p>
            <Link to="/" className="btn btn-primary mt-3">
                לך לעמוד הבית
            </Link>
        </div>
    );
};

export default Page404;