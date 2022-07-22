import { AuthorizationType } from "../home/home.component";

export class Singleton {
    public static AuthorizationType: AuthorizationType = AuthorizationType.None;
    public static Token: any;
    public static Language: string;
}