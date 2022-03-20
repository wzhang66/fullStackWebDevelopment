package com.example.demo.student;

import com.example.demo.exceptions.BadRequestException;
import com.example.demo.exceptions.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@AllArgsConstructor
@Service
public class StudentService {
    private final StudentRepository studentRepository;
    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        // check if email is taken
        Optional<Student> studentOptional = studentRepository.findStudentByEmail(student.getEmail());
        if(studentOptional.isPresent()){
            throw new BadRequestException("Email has been taken");
        }
        studentRepository.save(student);
    }

    public void deleteStudent(Long studentId){
        // check if student exists
        boolean exists = studentRepository.existsById(studentId);
        if(!exists){
            throw new StudentNotFoundException(
                "Student with id " + studentId + " does not exist!"
            );
        }
        studentRepository.deleteById(studentId);
    }

    public void updateStudent(Student student){
        Student currStudent = studentRepository.findById(student.getId()).orElseThrow(() -> new IllegalStateException(
                "student with id " + student.getId() + " does not exist"
        ));

        if(student.getName() != null && student.getName().length() > 0 && !Objects.equals(student.getName(), currStudent.getName())){
            currStudent.setName(student.getName());
        }

        if(student.getEmail() != null && student.getEmail().length() > 0 && !Objects.equals(student.getEmail(), currStudent.getEmail())){
            currStudent.setEmail(student.getEmail());
        }

        if(student.getGender() != null && !Objects.equals(student.getGender(), currStudent.getGender())){
            currStudent.setGender(student.getGender());
        }
        StringBuilder sb = new StringBuilder();
    }
}

