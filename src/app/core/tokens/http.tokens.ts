import { HttpContextToken } from "@angular/common/http";

export const USE_MOCK = new HttpContextToken<boolean>(() => false);