- hosts: front
become: true

tasks:
    - name: Install git
apt:
    name: git
state: present
update_cache: yes

- name : install Node.js and npm
apt:
    name: nodejs
state: present
update_cache: yes


- name : Clone repo
shell: git clone ssh://git@68.183.110.4:23/root/devops-front.git
    ignore_errors: yes

    - name : pull repo
shell: git pull
args:
    chdir: devops-front/

    - name : Install dependencies defined in package.json
npm: "path=devops-front"

- name: Install Angular
npm:
    name: "@angular/cli"
global: yes
state: present
path: "devops-front"

- name: copy front.service for systemd
    copy:
        src: ./front.service
dest: /etc/systemd/system/front.service

- name : Run service
systemd:
    name: front.service
state: started
enabled: yes
daemon_reload: yes
masked: no
