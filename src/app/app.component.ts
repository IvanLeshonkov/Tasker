import { Component, ViewChild, OnInit } from '@angular/core';

interface ITask {
  title: string;
  time: string;
  checked: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('addTitle') addTitle?: any;
  @ViewChild('addTime') addTime?: any;
  @ViewChild('filter') filter?: any;

  isShowEditForm: boolean = false;
  editFormValue: ITask = { title: '', time: '', checked: false };
  seasons: string[] = ['Все', 'Выполнено', 'Не выполнено'];
  filterTasks: ITask[] = [];
  tasks: ITask[] = [];

  ngOnInit(): void {
    const list = localStorage.getItem('list');
    if (list) {
      const transformList = JSON.parse(list);
      this.tasks = transformList;
      this.filterTasks = transformList;
    }
  }

  /**
   * Добавить задачу в список
   */
  addTask(): void {
    const title = this.addTitle?.nativeElement.value;
    const time = this.addTime?.nativeElement.value;
    const taskTitles = this.tasks.map((el) => el.title);

    if (title && !taskTitles.includes(title)) {
      const newTask = { title, time, checked: false };
      this.filterTasks.unshift(newTask);
      this.tasks.unshift(newTask);
      this.updateChach();

      if (this.filter.radioGroup._value) {
        this.changeFilter(this.filter.radioGroup._value);
      }
    }
  }

  /**
   * Сохраняем изменение статуса
   * @param value новое значение
   * @param taskChoice задача
   */
  setChecked(value: boolean, taskChoice: ITask): void {
    this.tasks = this.tasks.map((task: ITask) => {
      return taskChoice.title === task.title ? { ...task, checked: value } : task;
    });
    this.filterTasks = this.filterTasks.map((task: ITask) => {
      return taskChoice.title === task.title ? { ...task, checked: value } : task;
    });
    this.updateChach();
  }

  /**
   * Удаление задачи
   * @param taskChoice задача
   */
  deleteTask(taskChoice: ITask): void {
    this.tasks = this.tasks.filter((task: ITask) => task.title !== taskChoice.title);
    this.filterTasks = this.tasks.filter((task: ITask) => task.title !== taskChoice.title);
    this.updateChach();
  }

  /**
   * Фильтрация задач
   * @param value фильтр
   */
  changeFilter(value: string): void {
    switch(value) {
      case 'Все': {
        this.filterTasks = this.tasks;
        break;
      }
      case 'Выполнено': {
        this.filterTasks = this.tasks.filter((el: ITask) => el.checked);
        break;
      }
      case 'Не выполнено': {
        this.filterTasks = this.tasks.filter((el: ITask) => !el.checked);
        break;
      }
    }
  }

  editTask(taskChoice: ITask): void {
    this.tasks = this.tasks.filter((task: ITask) => task.title !== taskChoice.title);
    this.filterTasks = this.tasks.filter((task: ITask) => task.title !== taskChoice.title);
    setTimeout(() => {
      this.addTime.nativeElement.value = taskChoice.time;
      this.addTitle.nativeElement.value = taskChoice.title;
    });
  }

  private updateChach(): void {
    localStorage.setItem('list', JSON.stringify(this.tasks));
  }
}