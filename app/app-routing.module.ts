import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Layout1Component } from "./layout/layouts/layout-1/layout.component";
import { Layout2Component } from "./layout/layouts/layout-2/layout.component";


const routes: Routes = [
    {
        path: "",
        component: Layout1Component,
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full"
            },
            {
                path: "messages/:id",
                loadChildren: "./pages/messages/messages.module#MessagesModule"
            },
            {
                path: "home",
                loadChildren: "./pages/home/home.module#HomeModule"
            },
        ]
    },
    {
        path: "",
        component: Layout2Component,
        children: [
            {
                path: "",
                redirectTo: "login",
                pathMatch: "full"
            },
            {
                path: "login",
                loadChildren: "./pages/login/login.module#LoginModule"
            }
        ]
    }
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
