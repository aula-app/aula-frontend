import { AppLink } from "@/components";

/**
 * "Not Found" aka "Error 404" view
 */
const NotFoundViewView = () => (
  <div>
    <p>The page you are trying to access requires authentication</p>
    <p>
        Please consider&nbsp;
        <AppLink color="primary" component={AppLink} to="/">
          signing in
        </AppLink>
      </p>
  </div>
)

export default NotFoundViewView;
