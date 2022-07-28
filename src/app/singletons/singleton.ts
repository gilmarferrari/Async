import { AuthorizationType } from "../home/home.component";


// Dont use singletons, man
export class Singleton {
    public static AuthorizationType: AuthorizationType = AuthorizationType.None;
    public static Token: any;
    public static Language: string;
}
