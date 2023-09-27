import { getItemAsync, setItemAsync } from "expo-secure-store";
import { useAsync, useFetch } from "react-async";
import { config } from "../../consts";

// The type parameter names are in snake case,
// in order to be parsed correctly by the Python server.

type LoginDetails = {
    email: string;
    password: string;
    grant_type: string;
};

type RegisterDetails = {
    full_name: string;
    email: string;
    password: string;
    birth_date: string;
    city: string;
};

type LoginResponse = {
    access_token: string;
    token_type: string;
}

export function fetchToken(details: LoginDetails | RegisterDetails): string {
    const url = [config.BASE_URL, config.AUTH_URL].join();
    const { data, error } = useFetch<LoginResponse>(url, {
        method: "POST",
        body: JSON.stringify(details),
    });
    return data.access_token;
}

export function isTokenValid(token: string): boolean {
    const url = [config.BASE_URL, config.AUTH_URL].join();
    const { data, error } = useFetch<Response>(url, {
        method: "GET",
        body: JSON.stringify({ Authorization: "Bearer" + token }),
    });
    return data.status == 200;
}

export function saveToken(token: string): void {
    useAsync(setItemAsync("TOKEN", token));
}

export function getToken(): string {
    const { data, error } = useAsync<string>(getItemAsync("TOKEN"));
    if (data) return data;
    throw error;
}
