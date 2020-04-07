import { map } from 'rxjs/operators';
import { RolesModalComponent } from './../roles-modal/roles-modal.component';
import { AlertifyService } from './../../_services/alertify.service';
import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService,
              private alertifyService: AlertifyService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users : User[]) => {
      this.users = users;
    }, error => {
      this.alertifyService.error(error);
    })
  }

  editRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        roleNames: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      if(rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames]
        }, error => {
          this.alertifyService.error(error);
        });
      }
    });
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] =[
    {name: 'Admin', value: 'Admin'},
    {name: 'Moderator', value: 'Moderator'},
    {name: 'Member', value: 'Member'},
    {name: 'VIP', value: 'VIP'}];

    for( let i = 0; i < availableRoles.length; i++) {
      let isMatch = false;
      for(let j = 0; j < userRoles.length; j++) {
        if(availableRoles[i].name === userRoles[j]) {
          isMatch = true;
          availableRoles[i].checked = true;
          roles.push(availableRoles[i]);
          break;
        }
      }
      if(!isMatch) {
        availableRoles[i].cheched = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
  }
}
