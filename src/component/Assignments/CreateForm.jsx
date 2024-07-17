import { useEffect, useState } from 'react';
import { Checkbox, Label, TextInput, Button, Modal, FileInput, Select, Progress, Alert } from 'flowbite-react';
import { ImCross } from 'react-icons/im';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { app } from '../../firebase.js';
import { useSelector } from 'react-redux'

export function CreateForm({ openModal, setOpenModal, createAssignment }) {
  const [assignmentWeek, setAssignmentWeek] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [maxmarks, setMaxMarks] = useState(0);
  const [assignmentTechnology, setAssignmentTechnology] = useState('Java');
  const [assignmentDuedate, setAssignmentDuedate] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentFileName, setAssignmentFileName] = useState(null);
  const [assignedTo, setAssignedTo] = useState('');
  const [assignmentFileUrl, setAssignmentFileUrl] = useState(null);
  const [assignmentFileUploadProgress, setAssignmentFileUploadProgress] = useState(null);
  const [assignmentFileUploadError, setAssignmentFileUploadError] = useState(null);
  const [assignmentFileUploading, setAssignmentFileUploading] = useState(false);
  const [talentList, setTalentList] = useState([]);
  const [selectedTalents, setSelectedTalents] = useState([]);
  const [filteredTalentList, setFilteredTalentList] = useState([]);
  const [TrainerList, setTrainerList] = useState([])
  const [selectedTrainer, setselectedTrainer] = useState('')
  const [filteredTrainerList, setFilteredTrainerList] = useState([]);
  const baseUrl = process.env.BASE_URL2

  useEffect(() => {
    if (assignmentFile) {
      handleFileUpload();
    }
  }, [assignmentFile]);

  useEffect(() => {
    fetchTalentList();
    fetchTrainerData(); // Add this line
    fetchEvaluatorData();

  }, [])
  const token = useSelector(state => state.user.token)


  useEffect(() => {
    if (!assignmentTechnology) return 

    const filteredTalentList = talentList.filter(talent => {
      if (!talent.talentSkills) return false 
      const requiredSkills = talent.talentSkills
        .split(',')
        .map(skill => skill.trim())
      return requiredSkills.includes(assignmentTechnology)
    })
    setFilteredTalentList(filteredTalentList)

    const filteredTrainers = TrainerList.filter(trainer =>
      trainer.skills.includes(assignmentTechnology)
    )
    setFilteredTrainerList(filteredTrainers);

  }, [assignmentTechnology, talentList, TrainerList])

  const fetchTalentList = async () => {
    try {
      const response = await fetch(`${baseUrl}/cpm/talents/alltalent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch talent list');
      }
      const data = await response.json();
      console.log(data)
      setTalentList(data);
      console.log('Talent list:', data);
    } catch (error) {
      console.error('Error fetching talent list:', error);
    }
  }
  const fetchTrainerData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/trainers/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setTrainerList(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message)
    }
  }
  const handleselectedtalent = (talent, index) => {
    const newselectedtalent = selectedTalents.filter((tal, i) => tal != talent)
    setSelectedTalents(newselectedtalent)
  }
  const handleSelectAll = () => {
    if (selectedTalents.length === filteredTalentList.length) {
      setSelectedTalents([]);
    } else {
      const allTalents = filteredTalentList.map((talent) => talent.email);
      setSelectedTalents(allTalents);
    }
  };

  const handleSelectAllEvaluators = () => {
    if (selectedEvaluators.length === evaluatorList.length) {
      setSelectedEvaluators([]);
    } else {
      const allEvaluators = evaluatorList.map((evaluator) => evaluator.evaluatorId.toString());
      setSelectedEvaluators(allEvaluators);
    }
  };
  const handleRemoveEvaluator = (evaluatorId) => {
    setSelectedEvaluators(selectedEvaluators.filter((id) => id !== evaluatorId));
  };

  const selectedTalentEmails = selectedTalents.map((talent) => {
    const foundTalent = talentList.find((t) => t.email === talent);
    return foundTalent ? foundTalent.email : null;
  });
  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      assignmentWeek,
      maxmarks,
      assignmentName,
      assignmentTechnology,
      assignmentDuedate,
      assignmentFileName,
      assignmentFileUrl,
      assignedTo: selectedTalentEmails.join(', '),
      trainer: selectedTrainer,
      evaluatorId: selectedEvaluators, 

    }
    console.log(formData)
    createAssignment(formData)
  }

  const handleFileUpload = async () => {
    try {
      if (!assignmentFile) {
        setAssignmentFileUploadError('No file selected');
        return;
      }

      if (
        !assignmentFile.type.startsWith('application/pdf') ||
        assignmentFile.size > 2 * 1024 * 1024
      ) {
        setAssignmentFileUploadError('File must be of type pdf and less than 2MB');
        setAssignmentFile(null);
        setAssignmentFileUrl(null);
        setAssignmentFileUploadProgress(null);
        return;
      }

      setAssignmentFileUploadError(null);
      setAssignmentFileUploading(true);
      const storage = getStorage(app);
      const fileName = assignmentFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, assignmentFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setAssignmentFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setAssignmentFileUploadError('Could not upload file');
          setAssignmentFileUploadProgress(null);
          setAssignmentFile(null);
          setAssignmentFileName(null);
          setAssignmentFileUrl(null);
          setAssignmentFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setAssignmentFileUploadProgress(null);
            setAssignmentFileUrl(downloadURL);
            setAssignmentFileUploading(false);
            console.log(downloadURL);
          });
        }
      );
    } catch (error) {
      setAssignmentFileUploadError('Could not upload file');
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setAssignmentFile(e.target.files[0]);
    setAssignmentFileName(e.target.files[0].name);
  };
  const [evaluatorList, setEvaluatorList] = useState([]);
  const [selectedEvaluators, setSelectedEvaluators] = useState([]);
  const [filteredEvaluatorList, setFilteredEvaluatorList] = useState([]);

  useEffect(() => {
    fetchEvaluatorData();
  }, []);

  const fetchEvaluatorData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/evaluator/getallevaluator`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch evaluator list');
      }
      const data = await response.json();
      setEvaluatorList(data);
    } catch (error) {
      console.error('Error fetching evaluator list:', error);
    }
  };

  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentWeek" value="Assignment Week" />
            </div>
            <TextInput
              id="assignmentWeek"
              type="text"
              placeholder="Enter assignment week"
              value={assignmentWeek}
              onChange={(e) => setAssignmentWeek(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentName" value="Assignment Name" />
            </div>
            <TextInput
              id="assignmentName"
              type="text"
              placeholder="Enter assignment name"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              required
              size="sm"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentTechnology" value="Assignment Technology" />
            </div>
            <Select
              id="assignmentTechnology"
              value={assignmentTechnology}
              onChange={(e) => setAssignmentTechnology(e.target.value)}
              required
              size="sm"
            >
              <option>Java</option>
              <option>React</option>
              <option>JavaScript</option>
              <option>UI 5</option>
              <option>Integration</option>
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="trainerName" value="Trainer Name" />
            </div>
            <Select
              id="trainerName"
              value={selectedTrainer}
              onChange={(e) => setselectedTrainer(e.target.value)}
              required
              size="sm"
            >
              <option value="">Select a trainer</option>
              {filteredTrainerList.map((trainer) => (
                <option key={trainer.trainerId} value={trainer.email}>
                  {trainer.trainerName} - {trainer.email}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="MaxMarks" value="Max Marks" />
            </div>
            <TextInput
              id="maxmarks"
              type="text"
              placeholder="Enter Max Marks"
              value={maxmarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              required
              size="sm"
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentDuedate" value="Assignment Due Date" />
            </div>
            <TextInput
              id="assignmentDuedate"
              type="date"
              value={assignmentDuedate}
              onChange={(e) => setAssignmentDuedate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentFile" value="Assignment File" />
            </div>
            <FileInput
              id="assignmentFile"
              type="file"
              helperText="PDF (Max size 2 MB)"
              accept=".pdf"
              onChange={handleFileChange}
              required
              size="sm"
            />
          </div>
          {assignmentFileUploadProgress && (
            <Progress progress={assignmentFileUploadProgress} />
          )}
          {assignmentFileUploadError && (
            <Alert color="failure">{assignmentFileUploadError}</Alert>
          )}
          <div>
            <Select
              id='assignedTo'
              value={selectedTalents}
              onChange={(e) => {
                const selectedValues = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );

                const uniqueSelectedValues = selectedValues.filter(
                  (value) => !selectedTalents.includes(value)
                );
                setSelectedTalents((prevSelected) => [
                  ...prevSelected,
                  ...uniqueSelectedValues,
                ]);
              }}
              multiple
              size="sm"
            >
              {filteredTalentList.map((talent) => (
                <option key={talent.talentId} value={talent.email}>
                  {talent.talentName} - {talent.email}
                </option>
              ))}
            </Select>
            <div className="flex items-center mb-4 mt-2">
              <Checkbox
                id="selectAll"
                checked={selectedTalents.length === filteredTalentList.length}
                onChange={handleSelectAll}
              />
              <Label htmlFor="selectAll" className="ml-2">
                Select All
              </Label>
            </div>
            {selectedTalents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selected Talents:
                </label>
                <div className="mt-2 flex flex-wrap">
                  {selectedTalents.map((talent, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-md text-sm font-medium bg-blue-500 text-white"
                    >
                      {talent}
                      <div
                        onClick={() => handleselectedtalent(talent)}
                        className="ml-2 cursor-pointer"
                      >
                        <ImCross />
                      </div>
                    </span>
                  ))}
                </div>


              </div>

            )}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="evaluators" value="Select Evaluators" />
              </div>
              <Select
                id="evaluators"
                value={selectedEvaluators}
                onChange={(e) => {
                  const selectedValues = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  const uniqueSelectedValues = selectedValues.filter(
                    (value) => !selectedEvaluators.includes(value)
                  );
                  setSelectedEvaluators((prevSelected) => [
                    ...prevSelected,
                    ...uniqueSelectedValues,
                  ]);
                }}
                multiple
                size="sm"
              >
                {evaluatorList.map((evaluator) => (
                  <option key={evaluator.evaluatorId} value={evaluator.evaluatorId.toString()}>
                    {evaluator.evaluatorName} - {evaluator.email}
                  </option>
                ))}
              </Select>
              <div className="flex items-center mb-4 mt-2">
                <Checkbox
                  id="selectAllEvaluators"
                  checked={selectedEvaluators.length === evaluatorList.length}
                  onChange={handleSelectAllEvaluators}
                />
                <Label htmlFor="selectAllEvaluators" className="ml-2">
                  Select All Evaluators
                </Label>
              </div>
              {selectedEvaluators.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Selected Evaluators:
                  </label>
                  <div className="mt-2 flex flex-wrap">
                    {selectedEvaluators.map((evaluatorId) => {
                      const evaluator = evaluatorList.find(e => e.evaluatorId.toString() === evaluatorId);
                      return (
                        <span
                          key={evaluatorId}
                          className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-md text-sm font-medium bg-blue-500 text-white"
                        >
                          {evaluator ? `${evaluator.evaluatorName} - ${evaluator.email}` : evaluatorId}
                          <div
                            onClick={() => handleRemoveEvaluator(evaluatorId)}
                            className="ml-2 cursor-pointer"
                          >
                            <ImCross />
                          </div>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <Button type="submit" color="blue" size="sm">
            Create Assignment
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
